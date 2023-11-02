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

    const deviceDetailsForCalculate = [];

    try {
        currentSwitchingDetails.map((element) => {
            
            let pushElement = {
                device_id: element.device_id,
                switching_status: element.switching_status,
                device_type: deviceDetails[element.device_id].type,
            }

            deviceDetailsForCalculate.push(pushElement);
        })
    } catch (error) {
        throw new Error(
            "Error while processing elements: " + error.message
        );
    }

    const currentRoomStatusValue = (arrayDevices) => {
        // return Math.random()*100;
        let returnVal = 0;

        arrayDevices.forEach((element)=>{

            for(i = 0; i < arrayDevices.length; i++){
                const deviceType = element.device_type;
                if(element.switching_status === true){
                    switch (deviceType) {

                        case "LED 10W":
                            returnVal+=0.1;
                            break;
                      
                        case "LED 30W":
                            returnVal+=0.2;
                            break;
                      
                        case "CFL 50W":
                            returnVal+=0.3;
                            break;
        
                        case "CFL 80W":
                            returnVal+=0.4;
                            break;

                        case "CFL 100W":
                            returnVal+=0.5;
                            break;
                        
                        case "Tube Light 100W":
                            returnVal+=0.6;
                            break;
                        
                        case "Tube Light 200W":
                            returnVal+=0.7;
                            break;
        
                        case "Fan 250W":
                            returnVal+=0.8;
                            break;
                      
                        case "Fan 400W":
                            returnVal+=0.9;
                            break;

                        default:
                            returnVal+=Math.random();
                            break;
                    }                 
                }else{
                    returnVal+=0;
                } 
            }

        });

        return (returnVal/arrayDevices.length)*100;
    }


    const tobeRoomStatusValue = (roomOccupancy,
        roomType,
        roomWindowType,
        roomSize,
        placeType,
        placeCity
        ) => {

        const occupancyWeight = 0.2;
        const roomTypeWeight = 0.15;
        const windowTypeWeight = 0.1;
        const roomSizeWeight = 0.15;
        const placeTypeWeight = 0.2;

        const occupancyValue = roomOccupancy  === "High"? 80: roomOccupancy === "Medium"? 60: roomOccupancy === "Low"? 40:20;

        let roomTypeValue, windowTypeValue, sizeValue, placeTypeValue;


        if (roomType === 'type1') {
            roomTypeValue = 0.9;
        } else if (roomType === 'type2') {
            roomTypeValue = 0.8;
        } else {
            roomTypeValue = 0.7;
        }

        if (roomSize > 1000) {
            sizeValue = 0.9;
        } else if (roomSize >400) {
            sizeValue = 0.8;
        } else {
            sizeValue = 0.7;
        }

        if (roomWindowType === 'big') {
            windowTypeValue = 0.9;
        } else if (roomWindowType === 'medium') {
            windowTypeValue = 0.8;
        } else {
            windowTypeValue = 0.7;
        }

        if (placeType === 'economic') {
            placeTypeValue = 0.9;
        } else if (placeType === 'institute') {
            placeTypeValue = 0.8;
        } else {
            placeTypeValue = 0.7;
        }

        const apiKey = 'd3fd245a9bf35db532ffbc78fa9ee53c'; // Replace with your actual OpenWeather API key
        const city = placeCity;
        
        let latAndlon;// Replace with the city you want to get weather data for

        const apiUrlGeoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

        fetch(apiUrlGeoCode)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            latAndlon = data; // Store the weather data in a variable
            console.log('Weather Data:', weatherData);
        })
        .catch((error) => {
            console.error('Error:', error);
        });




        // if (placeType === 'economic') {
        //     placeTypeValue = 0.9;
        // } else if (placeType === 'institute') {
        //     placeTypeValue = 0.8;
        // } else {
        //     placeTypeValue = 0.7;
        // }

        const roomStatusValue =
            occupancyValue * occupancyWeight +
            roomTypeValue * roomTypeWeight +
            windowTypeValue * windowTypeWeight +
            sizeValue * roomSizeWeight +
            placeTypeValue * placeTypeWeight;

        const roomStatus = Math.min(Math.max(roomStatusValue * 100, 1), 100);

        return roomStatus;
        // return Math.random()*100;

        }


    let data = [];

    const lengthOfSS = Object.entries(currentSwitchingDetails).length;

    let term = (num)=>{
        if((2**length) < n){
            return 2**(length - 1);
        }else{
            return n;
        }
    }

    qty = term(lengthOfSS);

    const initialPopulation = (length, n)=>{

        const uniqueArrays = new Set();

        while (uniqueArrays.size < n) {
            const randomArray = Array.from({ length }, () => Math.floor(Math.random() * 2));
            uniqueArrays.add(JSON.stringify(randomArray)); // Convert the array to a string for Set comparison
        }

        return Array.from(uniqueArrays).map((str) => JSON.parse(str)); // Convert the strings back to arrays
    }
        
    const calculateStatusValue = (arrayDevices, arrayStates)=>{

        let returnVal = 0;

        arrayDevices.forEach((element)=>{

            for(i = 0; i < arrayDevices.length; i++){
                const deviceType = element.device_type;
                if(element.switching_status === true){
                    switch (deviceType) {
                
                        case "LED 10W":
                            returnVal+=0.1;
                            break;
                      
                        case "LED 30W":
                            returnVal+=0.2;
                            break;
                      
                        case "CFL 50W":
                            returnVal+=0.3;
                            break;
                        
                        case "CFL 80W":
                            returnVal+=0.4;
                            break;
                
                        case "CFL 100W":
                            returnVal+=0.5;
                            break;
                        
                        case "Tube Light 100W":
                            returnVal+=0.6;
                            break;
                        
                        case "Tube Light 200W":
                            returnVal+=0.7;
                            break;
                        
                        case "Fan 250W":
                            returnVal+=0.8;
                            break;
                      
                        case "Fan 400W":
                            returnVal+=0.9;
                            break;
                
                        default:
                            returnVal+=Math.random();
                            break;
                    }                 
                }else{
                    returnVal+=0;
                } 
            }

        });

        return (returnVal/arrayDevices.length)*100;
    }

    mutation = (offspring, length, qty, mutationFactor)=>{

        let uniqueArrays = new Set();

        while (uniqueArrays.size < qty) {
            
            const breakPoint = Math.floor(Math.random() * length);

            const arr1 = offspring[Math.floor(Math.random() * offspring.length)];
            const arr2 = offspring[Math.floor(Math.random() * offspring.length)];

            const part1 = arr1.slice(0, splitPoint);
            const part2 = arr2.slice(splitPoint);

            const newArray = part1.concat(part2);

            uniqueArrays.add(JSON.stringify(newArray)); 

            for(i = 0; i < mutationFactor*qty; i ++){

                const selectedId = Math.floor(Math.random()*qty);

                uniqueArrays[selectedId] = uniqueArrays[selectedId].map((value) => {
                    const randomBinary = Math.random() < 0.5 ? 1 : 0; 
                    return randomBinary;
                });
            }
        }

        return Array.from(uniqueArrays).map((str) => JSON.parse(str));
    }

    calculateFitness = (adamVal, godVal)=>{
        const larger = Math.max(adamVal, godVal);
        const smaller = Math.min(adamVal, godVal);
        return Math.abs((larger - smaller) / larger) * 100;
    }

    evolution = (lengthOfSwitchingScheme, deviceArray, chosenLength, calculatedToBeStatusVal)=>{
        
        const population = initialPopulation(lengthOfSwitchingScheme, chosenLength);

        let lowestYet = 100;
        let chosenPopulation
        let chosenOne = [];
        let indexArr = [];
        let previuosLowest = 100;
        let previousRatio;

        while(true){

            for(i = 0; i < population.length; i++){

                const statusVal = calculateStatusValue(deviceArray, population[i]);
                const fitnessVal = calculateFitness(statusVal, calculatedToBeStatusVal);
    
                if(fitnessVal < lowestYet){
                    lowestYet = fitnessVal;
                }
    
                const pushObj = {
                    index: i,
                    val: fitnessVal
                };
    
                indexArr.push(pushObj);
    
            }
    
            chosenPopulation  = (indexArr.sort((a, b) => a.val - b.val).slice(0, Math.floor(population.length/10)).map(obj => obj.val)).map(i => population[i]);

            const ratioNew = lowestYet/previuosLowest;

            const ratioDiff = ((ratioNew, ratioOld)=>{
                const larger = Math.max(ratioNew, ratioOld);
                const smaller = Math.min(ratioNew, ratioOld);
                return Math.abs((larger - smaller) / larger);
            })(ratioNew, previousRatio);

            if(ratioDiff < 0.8 || ratioDiff > 1.2){

                population = mutation(chosenPopulation, deviceArray.length, chosenLength, 0.1);

                previousRatio = ratioDiff;
                previuosLowest = lowestYet;
            }else{
                break;
            }
        }
        
        chosenOne = chosenPopulation[0];
        return chosenOne;
    }

    if(_.isEmpty(scheduleDetails)){

        s
        

    }else{

        

    }  

    return {
        data: data,
        status: 200
    };
    
}