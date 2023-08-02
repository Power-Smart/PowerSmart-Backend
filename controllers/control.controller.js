import sensor_data from "../models/sensor_data.model.js";
import device from "../models/device.model.js";
import model_predictions from "../models/model_prediction.model.js";
import sensor_unit from "../models/sensor_unit.model.js";
import device_switching from "../models/device_switching.model.js";
import room from "../models/room.model.js";
import place from "./models/place.model.js"
import schedule from "./models/schedule.model.js"
import axios from axios

import _ from 'lodash'
import sequelize from "sequelize";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const handleSensorData = async (req, res) => {
    try{

        const sensorId = req.params.id;
        const {co2_level, humudity_level, temperature, light_intensity, pir_reading, read_time} = req.body; 
        const recieve_time = new Date();

        const sensorDataArr = {
            sensor_id: sensorId, 
            co2_level: co2_level,
            humudity_level: humudity_level,
            temperature: temperature,
            light_intensity: light_intensity,
            pir_reading: pir_reading,
            read_time: read_time,
            recieve_time: recieve_time
        };

        const newSensorData = await sensor_data.create(sensorDataArr);

        newSensorData.save();

        res.status(201).json({
            message: "Recieved Successfully",
        });

        const modelPredictions = await axios.post('/mlapi/getPredictions', sensorDataArr);

        if (modelPredictions.status >= 200 && modelPredictions.status < 300) {

            const {sensor_id, occupancy_rate, room_status, sent_time} = modelPredictions.data;

            const roomId = await sensor_unit.findAll({
                attributes: ['room_id'],
                where: {sensor_id: sensorId} 
            });

            const sensorStatus = await sensor_unit.findAll({
                attributes: ['status'],
                where: {sensor_id: sensorId} 
            });

            if(!sensorStatus){
                throw new Error("Sensor is deactivated");
            }

            
            const modelPredictionsArr = {
                room_id: roomId,
                occupancy_rate: occupancy_rate,
                room_status: room_status,
                sent_time: sent_time,
                recieve_time: new Date()
            };

            const newModelPredictions = await model_predictions.create(modelPredictionsArr); 

            newModelPredictions.save();

            const thisRoom = await room.findOne({
                where: {room_id: roomId}
            });

            // const thisRoom = thisRoomResponse.room_id;

            if(_.isEmpty(thisRoom)){
                throw new Error("No Room found");
            }

            const thisPlace = await place.findOne({
                where: {place_id: thisRoom.place_id}
            })

            const devicesInRoom = await device.findAll({
                where: {
                    room_id: roomId,
                    is_active: 'active'
                }
            });

            const devicesIdsInnRoom = await Promise.all(devicesInRoom.data.map(async (element)=>{
                return element.device_id;
            }));
            
            const currentDeviceSwitching = await device_switching.findAll({
                where: {
                    device_id: devicesIdsInnRoom,
                    status: 'active'
                }
            });


            var schedules = [];

            try {
               
                await Promise.all(currentDeviceSwitching.data.map(async (element) => {
                    if(element.whichSchedule !== null){
                          schedules.push(await schedule.findOne({
                            where: {
                                schedule_id: element.wchich_schedule,
                            }
                            }));
                    }

                }));
                } catch (error) {
           
                throw new Error("Error while processing elements: " + error.message);
                }

            

            const decisionAlgoRequestData = {
                predictions: JSON.stringify(modelPredictionsArr),
                roomDetails: JSON.stringify(thisRoom),
                placeDetails: JSON.stringify(thisPlace),
                currentSwitchingDetails: JSON.stringify(currentDeviceSwitching),
                scheduleDetails: JSON.stringify(_.uniq(schedules)),
                deviceDetails: JSON.stringify(devicesInRoom)
            };

            const decisions = await axios.post('/decisionAlgorithm/', decisionAlgoRequestData);

            if (decisions.status >= 200 && decisions.status < 300) {
                try {
                // Define the forEach callback function as async
                await Promise.all(decisions.data.map(async (element) => {
                    const deviceToSwitch = await device_switching.findAll({
                        where: {
                            device_id: element.device_id,
                            status: 'active'
                        }
                    });
                    
                    if(_.isEmpty(deviceToSwitch)){
                        throw new Error("No devices found.");
                    }

                    try{
                        await Promise.all(deviceToSwitch.data.map(async (element)=>{
                            const deviceSwitchChangeResults = await device_switching.update({
                               status: 'inactive_pending'
                            },
                            {
                                where: {
                                    device_id: element.device_id,
                                    status: 'active'
                                }
                            });

                            if(_.isEmpty(deviceSwitchChangeResults)){
                                throw new Error("Error while updating switching scheme"+ error.message);
                            }
                        }));
                    }catch(error){
                        throw new Error("Something happened"+ error.message);
                    }

                }));
                } catch (error) {
                // Handle any errors that occur during the await calls
                throw new Error("Error while processing elements: " + error.message);
                }

                try{
                    await Promise.all(decisions.data.map(async (element)=>{
                        let deviceSwitchingAccordingToDecisions = {
                            device_id: element.device_id,
                            switch_status: element.switch_status,
                            activity: 'prediction',
                            wchich_schedule: null,
                            status: 'active_pending',
                            changed_at: new Date()
                        }

                        const newdeviceSwitchingAccordingToDecisions = await device_switching.create(deviceSwitchingAccordingToDecisions);

                        newdeviceSwitchingAccordingToDecisions.save();

                    }));

                    const [relaySocketDeviceSwithResults, metadata] = await sequelize.query(`SELECT device_switching.device_id, device_switching.switch_status, device.relay_id, device.socket FROM 'device_switching' WHERE room_id=${roomId} AND activity='prediction' AND status='active_pending' INNER JOIN device ON device_switching device_switching.device_id = device.device_id`);

                    let wsServerDataToSend = {};

                    try{

                        await Promise.all(relaySocketDeviceSwithResults.data.map(async (element)=>{
                            
                            if(!wsServerDataToSend.hasOwnProperty(element.realy_id)){
                                wsServerDataToSend[element.realy_id] = {};
                            }

                            wsServerDataToSend[element.realy_id][element.socket] = element.switch_status;
    
                        }));

                    }catch(error){
                        throw new Error("Internal processing error"+ error.message);
                    }

                    let fillCount = 0;

                    let remainingRelays = [];
                    let doneRelays = [];

                    async function sendToWs(wsServerData,errorRepeatCount){


                        let count = 0;

                        while (count < errorRepeatCount) {
                          try {
                            const wsServerResponse = await axios.post('/wsserver/checkThisOut', wsServerData);
                      
                            if (wsServerResponse.status >= 200 && wsServerResponse.status < 300 && _.isEmpty(wsServerResponse.data[notFoundRelays])) {

                                try{
                                    const deviceSwitchChangeResultsAfterSwitchingActive = await device_switching.update(

                                        { status: 'inactive' },
                                        { where: { 
                                            device_id:devicesIdsInnRoom,
                                            status: 'inactive_pending' 
                                            } 
                                        }
                                    );

                                    const deviceSwitchChangeResultsAfterSwitchingInactive = await device_switching.update(

                                        { status: 'active' },
                                        { where: { 
                                            device_id: devicesIdsInnRoom,
                                            status: 'active_pending' 
                                            } 
                                        }
                                    );

                                    doneRelays.push(wsServerData.data[foundRelays]);
                                    
                                    throw new Error("Operation Successful");

                                }catch(error){
                                    throw new Error(error.message);
                                }                               
                                
                            }else if(wsServerResponse.status >= 200 && wsServerResponse.status < 300){

                                doneRelays.push(wsServerData.data[foundRelays]);

                                if(fillCount < 3){
                                    

                                    try{
                                        const deviceSwitchChangeResultsAfterSwitchingActive = await device_switching.update(
    
                                            { status: 'inactive' },
                                            { where: { 
                                                device_id: async ()=>{
                                                    wsServerResponse.data[foundRelays].map.set(async (element) => {
                                                        Object.entries(element).forEach(async ([key, value])=>{
                                                            Object.entries(value).forEach(async ([k,v])=>{
                                                                return await device.findOne({
                                                                    attributes: ['device_id'],
                                                                    where: {
                                                                        relay_id: key,
                                                                        socket: k
                                                                    }
                                                                });
                                                            });
                                                        });

                                                    });
                                                },
                                                
                                                status: 'inactive_pending' 
                                                } 
                                            }
                                        );
    
                                        const deviceSwitchChangeResultsAfterSwitchingInactive = await device_switching.update(
    
                                            { status: 'active' },
                                            { where: { 
                                                device_id: async ()=>{
                                                    wsServerResponse.data[foundRelays].map.set(async (element) => {
                                                        Object.entries(element).forEach(async ([key, value])=>{
                                                            Object.entries(value).forEach(async ([k,v])=>{
                                                                return await device.findOne({
                                                                    attributes: ['device_id'],
                                                                    where: {
                                                                        relay_id: key,
                                                                        socket: k
                                                                    }
                                                                });
                                                            });
                                                        });

                                                    });
                                                },
                                                status: 'active_pending' 
                                                } 
                                            }
                                        );

                                        async ()=> {
                                            await delay(500);            
                                        }

                                        const constForReturnVal = await sendToWs(wsServerResponse.data[notFoundRelays],3); 

                                        fillCount++;
    
                                    }catch(error){
                                        throw new Error(error.message);
                                    }      
                                }else{

                                    remainingRelays.push(wsServerResponse.data[notFoundRelays]);
                                }

                            }else{

                              count++;
                              
                              async ()=> {
                                await delay(500);
                              }

                              if(count === errorRepeatCount){
                                throw new Error("Internal server error");
                              }

                            }

                          } catch (error) {
                            return error.message;
                          }


                        }
                    }

                    throw new Error(await sendToWs(wsServerData,10)); 
                    
                      
                                        
                }catch(error){

                    if(error.message === "Internal server error"){
                        try{
                            const deviceSwitchChangeResultsAfterInternalErrorActive = await device_switching.update(
    
                                { status: 'active' },
                                { where: { 
                                    device_id: async ()=>{
                                        wsServerResponse.data[NotFoundRelays].map.set(async (element) => {
                                            Object.entries(element).forEach(async ([key, value])=>{
                                                Object.entries(value).forEach(async ([k,v])=>{
                                                    return await device.findOne({
                                                        attributes: ['device_id'],
                                                        where: {
                                                            relay_id: key,
                                                            socket: k
                                                        }
                                                    });
                                                });
                                            });

                                        });
                                    },
                                    status: 'inactive_pending' 
                                    } 
                                }
                            );
    
                            const deviceSwitchDeleteResultsAfterInternalError = await device_switching.delete(
    
                                { where: { 
                                    device_id: async ()=>{
                                        wsServerResponse.data[NotFoundRelays].map.set(async (element) => {
                                            Object.entries(element).forEach(async ([key, value])=>{
                                                Object.entries(value).forEach(async ([k,v])=>{
                                                    return await device.findOne({
                                                        attributes: ['device_id'],
                                                        where: {
                                                            relay_id: key,
                                                            socket: k
                                                        }
                                                    });
                                                });
                                            });

                                        });
                                    },
                                    status: 'active_pending' 
                                    } 
                                }
                            );
    
                            throw new Error("Switching Aborted due to internal error");
    
                        }catch(error){
                            throw new Error(error.message);
                        }
                    }

                    throw new Error(error.message);
                }
            } else {
                throw new Error("Decision Invalid");
            }

        }else{
           throw new Error("Prediction Invalid");
        }      


    } catch (error) {
        if(error.message === "Operation Successful"){
            res.status(200).send(error.message);

        }else{
            res.status(500).send(error.message);
            
        }
    }
}

