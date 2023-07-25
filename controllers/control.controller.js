import sensor_data from "../models/sensor_data.model.js";
import model_predictions from "../models/model_prediction.model.js";
import sensor_unit from "../models/sensor_unit.model.js";
import device_switching from "../models/device_switching.model.js";
import room from "../models/room.model.js";
import place from "./models/place.model.js"
import schedule from "./models/schedule.model.js"
import axios from axios

var _ = require('lodash');

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

            
            const modelPredictionsArr = {
                room_id: roomId,
                occupancy_rate: occupancy_rate,
                room_status: room_status,
                sent_time: sent_time,
                recieve_time: new Date()
            };

            const newModelPredictions = await model_predictions.create(modelPredictionsArr); 

            newModelPredictions.save();

            const thisRoom = await room.findAll({
                where: {room_id: roomId}
            });

            if(_.isEmpty(thisRoom)){
                throw new Error("No Room found");
            }

            const thisPlace = await place.findAll({
                where: {place_id: thisRoom.place_id}
            })
            
            const currentDeviceSwitching = await device_switching.findAll({
                where: {
                    room_id: roomId,
                    status: 'active'
                }
            });

            const devicesInRoom = await device_switching.findAll({
                where: {
                    room_id: roomId,
                    is_active: 'active'
                }
            });

            var schedules;

            try {
                // Define the forEach callback function as async
                await Promise.all(currentDeviceSwitching.data.map(async (element) => {
                    if(element.whichSchedule !== null){
                         const schedulesActive = await schedule.findAll({
                            where: {
                                schedule_id: element.wchich_schedule,
                            }
                            });
                        schedules = schedulesActive;
                    }

                }));
                } catch (error) {
                // Handle any errors that occur during the await calls
                throw new Error("Error while processing elements: " + error.message);
                }

            

            const decisionAlgoRequestData = {
                predictions: JSON.stringify(modelPredictionsArr),
                roomDetails: JSON.stringify(thisRoom),
                placeDetails: JSON.stringify(thisPlace),
                currentSwitchingDetails: JSON.stringify(currentDeviceSwitching),
                scheduleDetails: JSON.stringify(schedules),
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
                        throw new Error("Hknw dla");
                    }

                    try{
                        await Promise.all(deviceToSwitch.data.map(async (element)=>{
                            const deviceSwitchChangeResults = await device_switching.update({
                               status: 'inactive'
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
                        throw new Error("wtf happening"+ error.message);
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
                            changed_at: new Date()
                        }

                        const newdeviceSwitchingAccordingToDecisions = await device_switching.create(deviceSwitchingAccordingToDecisions);

                        newdeviceSwitchingAccordingToDecisions.save();

                    }));

                    const wsServerResponse = axios.post('/wsserver/checkThisOut', {
                        roomId: roomId,
                    });

                }catch(error){
                    throw new Error("Error :-) "+error.message);
                }
            } else {
                throw new Error("Decision Invalid");
            }

        }else{
           throw new Error("Prediction Invalid");
        }      


    } catch (e) {
        res.status(500).send();
    }
}