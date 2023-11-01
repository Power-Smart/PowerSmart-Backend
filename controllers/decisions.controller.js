import sensor_data from "../models/sensorData.model.js";
import device from "../models/device.model.js";
import model_predictions from "../models/modelPrediction.model.js";
import sensor_unit from "../models/sensorUnit.model.js";
import device_switching from "../models/deviceSwitching.model.js";
import room from "../models/room.model.js";
import Place from "../models/place.model.js";
import schedule from "../models/schedule.model.js";
import axios from "axios";
import db from "../models/index.js";
import _ from "lodash";
import fetch from "node-fetch";

export const getDecisions = async (decisionAlgoRequestData) => {

    const {
        model_predictions,
        roomDetails,
        placeDetails,
        currentSwitchingDetails,
        scheduleDetails,
        deviceDetails
    } = decisionAlgoRequestData;
    
    const roomOccupancy = model_predictions.occupancy_rate;

    const roomType = roomDetails.type;
    const roomWindowType = roomDetails.window_type 
    const roomSize = roomDetails.size;

    const placeType = placeDetails.place_type;
    const placeCity = placeDetails.city;

    const currentRoomStatusValue = await new promise(() => {
        return Math.random()*100;
    })

    const tobeRoomStatusValue = await new promise(() => {
        return Math.random()*100;
    })

    let data = [];

    if(_.isEmpty(scheduleDetails)){

        if(currentRoomStatusValue < tobeRoomStatusValue - tobeRoomStatusValue*0.10){

            try {
                await Promise.all(
                    currentSwitchingDetails.map(async (element) => {
                        
                        let pushVar = {
                            device_id: element.device_id,
                            switch_status: Math.random() < 0.5
                        }

                        data.push(pushVar);
                    })
                );
            } catch (error) {
                return(
                    "Error while processing elements: " + error.message
                );
            }
            
                        
        }else if(currentRoomStatusValue > tobeRoomStatusValue + tobeRoomStatusValue*0.10){

            try {
                await Promise.all(
                    currentSwitchingDetails.map(async (element) => {
                        
                        let pushVar = {
                            device_id: element.device_id,
                            switch_status: Math.random() < 0.5
                        }

                        data.push(pushVar);
                    })
                );
            } catch (error) {
                return(
                    "Error while processing elements: " + error.message
                );
            }

        }else{

            try {
                await Promise.all(
                    currentSwitchingDetails.map(async (element) => {
                        
                        let pushVar = {
                            device_id: element.device_id,
                            switch_status: Math.random() < 0.5
                        }

                        data.push(pushVar);
                    })
                );
            } catch (error) {
                return(
                    "Error while processing elements: " + error.message
                );
            }
        }  

    }else{

        try {
            await Promise.all(
                currentSwitchingDetails.map(async (element) => {
                    
                    let pushVar = {
                        device_id: element.device_id,
                        switch_status: Math.random() < 0.5
                    }

                    data.push(pushVar);
                })
            );
        } catch (error) {
            return(
                "Error while processing elements: " + error.message
            );
        }

    }  

    return {
        data: data,
        status: 200
    };
    
}