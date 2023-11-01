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
    });

    const deviceDetailsForCalculate = [];

    try {
        await Promise.all(
            currentSwitchingDetails.map(async (element) => {
                
                let pushElement = {
                    device_id: element.device_id,
                    device_type: element.type,
                }

                deviceDetailsForCalculate.push(pushElement);
            })
        );
    } catch (error) {
        throw new Error(
            "Error while processing elements: " + error.message
        );
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

    const initialPopulation = async (length, n)=>{

        const uniqueArrays = new Set();

        while (uniqueArrays.size < n) {
            const randomArray = Array.from({ length }, () => Math.floor(Math.random() * 2));
            uniqueArrays.add(JSON.stringify(randomArray)); // Convert the array to a string for Set comparison
        }

        return Array.from(uniqueArrays).map((str) => JSON.parse(str)); // Convert the strings back to arrays
    }
        
    const calculateStatusValue = async (arrayDevices, arrayStates)=>{

        let returnVal = 0;

        arrayDevices.forEach((element)=>{

            const deviceType = element.device_type;

            for(i = 0; i < arrayDevices.length; i++){
                if(arrayStates[i] == 1){
                    switch (deviceType) {

                        case "Type1":
                            returnVal+=0.1;
                            break;
                      
                        case "Type2":
                            returnVal+=0.2;
                            break;
                      
                        case "Type3":
                            returnVal+=0.3;
                            break;
        
                        case "Type4":
                            returnVal+=0.4;
                            break;

                        case "Type5":
                            returnVal+=0.5;
                            break;
                        
                        case "Type6":
                            returnVal+=0.6;
                            break;
                        
                        case "Type7":
                            returnVal+=0.7;
                            break;
        
                        case "Type8":
                            returnVal+=0.8;
                            break;
                      
                        case "Type9":
                            returnVal+=0.9;
                            break;
        
                        case "Type0":
                            returnVal+=0;
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

    mutation = (offspring, length, qty)=>{

        const uniqueArrays = new Set();

        while (uniqueArrays.size < qty) {
            
            const breakPoint = Math.floor(Math.random() * length);

            const arr1 = offspring[Math.floor(Math.random() * offspring.length)];
            const arr2 = offspring[Math.floor(Math.random() * offspring.length)];

            const part1 = arr1.slice(0, splitPoint);
            const part2 = arr2.slice(splitPoint);

            const newArray = part1.concat(part2);

            uniqueArrays.add(JSON.stringify(newArray)); 
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

                population = mutation(chosenPopulation, );
            }else{

            }
        }        

    }

    if(_.isEmpty(scheduleDetails)){

        

    }else{

        

    }  

    return {
        data: data,
        status: 200
    };
    
}