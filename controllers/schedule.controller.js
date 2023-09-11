import device from "../models/device.model.js";
import model_predictions from "../models/modelPrediction.model.js";
import sensor_unit from "../models/sensorUnit.model.js";
import device_switching from "../models/deviceSwitching.model.js";
import room from "../models/room.model.js";
import place from "../models/place.model.js";
import Schedule from "../models/schedule.model.js";
import axios from "axios";
import db from "../models/index.js";
import _ from "lodash";
import fetch from "node-fetch";
import DeviceSchedule from "../models/deviceSchedule.model.js";

const ISL = "internal server error";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const createSchedule = async (req, res) => {

    try{
        const {scheduleDetails, deviceDetails} = req.body

        if(_.isNull(scheduleDetails) || _.isNull(deviceDetails)){
            throw new Error("Cannot process. Empty body");
        }

        const {
            name,
            status,
            startTime,
            endTime,
            startDay,
            endDay,
            automationOverride,
            manualOverride,
            scheduleOverride,
            userId,
            placeId
        }  = scheduleDetails;

        const newScheduleId = async ()=>{return Math.floor(Math.random*100_000_000_000_000)}

        // const allSchedulesResponse = await schedule.findAll({
        //     attributes: ['schedule_id'],
        // });

        // const allSchedules = await Promise.all(
        //     devicesInRoom.map(async (element) => {
        //         return element.dataValues.device_id;
        //     })
        // );

        let callCount = 0;

        async function writeToSchedulesTable(scheduleIdGuessed){
            try{

                const scheduleDetailsArr = {
                    schedule_id : scheduleIdGuessed,
                    name: name,
                    status: status,
                    start_time: startTime,
                    end_time: endTime,
                    start_day: startDay,
                    end_day: endDay,
                    automation_override: automationOverride,
                    manual_override: manualOverride,
                    schedule_override: scheduleOverride,
                    user_id: userId,
                    place_id: placeId
                };

                const newSchedule = await Schedule.create(scheduleDetailsArr);

                if(newSchedule.schedule_id === scheduleIdGuessed){
                    return scheduleIdGuessed;
                }else{
                    throw new Error("creation error.");
                }

            }catch(error){
                if(callCount < 10){
                    callCount++;
                    async () => {
                        await delay(100);
                    };
                    await writeToSchedulesTable(newScheduleId);    
                }else{
                    return false;
                }
                
            }
        }

        const scheduleIdGuessedFinal = await writeToSchedulesTable(newScheduleId());

        if(!scheduleIdGuessedFinal){
            throw new Error(ISL);
        }

       
    try{
        Object.entries(deviceDetails).forEach(([key, value]) => {
            const deviceScheduleInsertArray = {
                device_id: key,
                schedule_id: scheduleIdGuessedFinal,
                swith_status: value
            }

            const deviceScheduleInsertResult =  DeviceSchedule.create(deviceScheduleInsertArray);
            });

            if(_.isNull(deviceScheduleInsertResult)){
                throw new Error(ISL);
            }

    }catch(error){
        throw new Error(ISL);
    }

    const placeTimeZoneResult = await Place.findOne({
        attributes: ['timeZone'],
        where: {
            place_id: placeId
        }
    });

    const placeTimeZone = placeTimeZoneResult;

    const cronServerUrl = "https://powersmart-cron-server.onrender.com/create";

    const requestData = {
        scheduleId: scheduleIdGuessedFinal,
        startTime: startTime,
        endTime: endTime,
        startDay: ((day)=>(day === 'mon'?1:day === 'tue'? 2 : day === 'wed' ? 3: day === 'thu'? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(startDay),
        endDay: ((day)=>(day === 'mon'?1:day === 'tue'? 2 : day === 'wed' ? 3: day === 'thu'? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(endDay),
        switchingScheme: deviceDetails,
        timeZone: placeTimeZone
    };

    axios.post(cronServerUrl, requestData).then(
        (response) => {
            console.log(response);
            res.status(200).json(response.data);
        }
    ).catch(
        (error) => {
            console.log(error);

            const deviceScheduleIDeleteResult =  DeviceSchedule.destroy({
                where:{
                    schedule_id: scheduleIdGuessedFinal
                }
            });

            const sheduleIDeleteResult =  Schedule.destroy({
                where:{
                    schedule_id: scheduleIdGuessedFinal
                }
            });

            throw new Error(ISL);
        }
    );
        

    }catch(error){

        if(error.message === ISL){
            res.status(500).json(error.message);
        }

    }
}

export const deleteSchedule = async (req,res) => {

    try {

        const {scheduleId} = req.body;

        const requestData = req.body;

        const cronServerUrl = "https://powersmart-cron-server.onrender.com/delete";


        axios.post(cronServerUrl, requestData).then(
            (response) => {
                console.log(response); 

                const deviceScheduleIDeleteResult =  DeviceSchedule.destroy({
                    where:{
                        schedule_id: scheduleId
                    }
                });
    
                const sheduleIDeleteResult =  Schedule.destroy({
                    where:{
                        schedule_id: scheduleId
                    }
                });

                res.status(200).json(response.data);
            }
        ).catch(
            (error) => {
                console.log(error);
        
                throw new Error(ISL);
            }
        );

        

    }catch(error){
        if(error.message === ISL){
            res.status(500).json(error.message);
        }
    }
}

export const updateSchedule = async (req,res) => {

    try {

        const {scheduleDetails, deviceDetails} = req.body

        const {
            sceduleId,
            name,
            status,
            startTime,
            endTime,
            startDay,
            endDay,
            automationOverride,
            manualOverride,
            scheduleOverride,
            userId,
            placeId
        }  = scheduleDetails;

        const scheduleDetailsArr = {
            schedule_id : sceduleId,
            name: name,
            status: status,
            start_time: startTime,
            end_time: endTime,
            start_day: startDay,
            end_day: endDay,
            automation_override: automationOverride,
            manual_override: manualOverride,
            schedule_override: scheduleOverride,
            user_id: userId,
            place_id: placeId
        };

        const placeTimeZoneResult = await Place.findOne({
            attributes: [],
            where: {
                place_id: placeId
            }
        });
    
        const placeTimeZone = placeTimeZoneResult;
    
        const cronServerUrl = "https://powersmart-cron-server.onrender.com/update";
    
        const requestData = {
            scheduleId: scheduleIdGuessedFinal,
            startTime: startTime,
            endTime: endTime,
            startDay: ((day)=>(day === 'mon'?1:day === 'tue'? 2 : day === 'wed' ? 3: day === 'thu'? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(startDay),
            endDay: ((day)=>(day === 'mon'?1:day === 'tue'? 2 : day === 'wed' ? 3: day === 'thu'? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(endDay),
            switchingScheme: deviceDetails,
            timeZone: placeTimeZone
        };


        axios.post(cronServerUrl, requestData).then(
            (response) => {
                console.log(response); 

                const deviceScheduleIDeleteResult =  DeviceSchedule.destroy({
                    where:{
                        schedule_id: scheduleId
                    }
                });
    
                const sheduleIDeleteResult =  Schedule.destroy({
                    where:{
                        schedule_id: scheduleId
                    }
                });

                res.status(200).json(response.data);
            }
        ).catch(
            (error) => {
                console.log(error);
        
                throw new Error(ISL);
            }
        );

        

    }catch(error){
            res.status(500).json(error.message);
    }
}