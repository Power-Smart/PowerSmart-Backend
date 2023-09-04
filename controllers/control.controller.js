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


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const handleSensorData = async (req, res) => {
    try {
        const sensorId = req.params.id;
        const {
            co2_level,
            hummidity_level,
            temperature,
            light_intensity,
            pir_reading,
        } = req.body;

        const recieve_time = new Date();
        const read_time = new Date();

        const sensorDataArr = {
            sensor_unit_id: sensorId,
            co2_level: co2_level,
            hummidity_level: hummidity_level,
            temperature: temperature,
            light_intensity: light_intensity,
            pir_reading: pir_reading,
            read_time: read_time,
            recieve_time: recieve_time,
        };

        const newSensorData = await sensor_data.create(sensorDataArr);

        // newSensorData.save();

        // res.status(201).json({
        //     message: "Recieved Successfully",
        // });

        //! model predictions api
        // const modelPredictions = await axios.post(
        //     "/mlapi/getPredictions",
        //     sensorDataArr
        // );

        const modelPredictions = {
            data: {
                occupancy_rate: "medium",
                room_status: "normal",
                sent_time: new Date(),
            },
        };

        //! model predictions status check
        // if (modelPredictions.status >= 200 && modelPredictions.status < 300) {

        if (true) {
            const { occupancy_rate, room_status, sent_time } =
                modelPredictions.data;

            const roomData = await sensor_unit.findOne({
                //Can done via same query (1)
                attributes: ["room_id"],
                where: { sensor_unit_id: sensorId },
            });

            const roomId = roomData.dataValues.room_id;

            const sensorStatusData = await sensor_unit.findOne({
                attributes: ["status"],
                where: { sensor_unit_id: sensorId },
            });

            const sensorStatus = sensorStatusData.dataValues.status;

            if (!sensorStatus) {
                throw new Error("Sensor is deactivated");
            }

            const modelPredictionsArr = {
                room_id: roomId,
                occupancy_rate: occupancy_rate,
                room_status: room_status,
                sent_time: sent_time,
                recieve_time: new Date(),
            };

            const newModelPredictions = await model_predictions.create(
                modelPredictionsArr
            );

            // newModelPredictions.save();

            const thisRoom = (
                await room.findOne({
                    //Can done via same query (1)
                    where: { room_id: roomId },
                })
            ).dataValues;

            // const thisRoom = thisRoomResponse.room_id;

            if (_.isEmpty(thisRoom)) {
                throw new Error("No Room found");
            }

            const thisPlace = (
                await place.findOne({
                    where: { place_id: thisRoom.place_id },
                })
            ).dataValues;

            const devicesInRoom = await device.findAll({
                where: {
                    room_id: roomId,
                    is_active: true,
                },
            });

            const devicesIdsInnRoom = await Promise.all(
                devicesInRoom.map(async (element) => {
                    return element.dataValues.device_id;
                })
            );

            const currentDeviceSwitching = await device_switching.findAll({
                where: {
                    device_id: devicesIdsInnRoom,
                    status: "active",
                },
            });

            let schedules = [];

            //! shedules
            // try {
            //     await Promise.all(
            //         currentDeviceSwitching.map(async (element) => {
            //             if (element.whichSchedule !== null) {
            //                 schedules.push(
            //                     await schedule.findOne({
            //                         where: {
            //                             schedule_id: element.wchich_schedule,
            //                         },
            //                     })
            //                 );
            //             }
            //         })
            //     );
            // } catch (error) {
            //     throw new Error(
            //         "Error while processing elements: " + error.message
            //     );
            // }

            const decisionAlgoRequestData = {
                predictions: JSON.stringify(modelPredictionsArr),
                roomDetails: JSON.stringify(thisRoom),
                placeDetails: JSON.stringify(thisPlace),
                currentSwitchingDetails: JSON.stringify(currentDeviceSwitching),
                scheduleDetails: _.uniq(schedules),
                deviceDetails: JSON.stringify(devicesInRoom),
            };

            //! decision algorithm api
            // const decisions = await axios.post(
            //     "/decisionAlgorithm/",
            //     decisionAlgoRequestData
            // );

            const decisions = {
                data: [
                    {
                        device_id: 2,
                        switch_status: Math.random() < 0.5
                        }
                        ,
                    {
                        device_id: 3,
                        switch_status:Math.random() < 0.5
                    },
                ],
                status: 200,
            };

            if (decisions.status >= 200 && decisions.status < 300) {
                try {
                    // Define the forEach callback function as async
                    await Promise.all(
                        decisions.data.map(async (element) => {
                            const deviceToSwitchData =
                                await device_switching.findOne({
                                    where: {
                                        device_id: element.device_id,
                                        status: "active",
                                    },
                                });

                            if (!_.isNull(deviceToSwitchData)) {
                                const deviceToSwitch =
                                    deviceToSwitchData.dataValues;
                                // const deviceToSwitch = decisions.data['device'];

                                if (!_.isEmpty(deviceToSwitch)) {
                                    try {
                                        // await Promise.all(deviceToSwitch.map(async (element)=>{
                                        const deviceSwitchChangeResults =
                                            await device_switching.update(
                                                {
                                                    status: "inactive_pending",
                                                },
                                                {
                                                    where: {
                                                        device_id:
                                                            deviceToSwitch.device_id,
                                                        status: "active",
                                                    },
                                                }
                                            );

                                        if (
                                            _.isEmpty(deviceSwitchChangeResults)
                                        ) {
                                            throw new Error(
                                                "Error while updating switching scheme"
                                            );
                                        }
                                        // }));
                                    } catch (error) {
                                        throw new Error(error.message);
                                    }
                                }
                            }
                        })
                    );
                } catch (error) {
                    // Handle any errors that occur during the await calls
                    throw new Error(error.message);
                }

                let wsServerResponseCopy = {}
                try {
                    await Promise.all(
                        decisions.data.map(async (element) => {
                            let deviceSwitchingAccordingToDecisions = {
                                device_id: element.device_id,
                                switch_status: element.switch_status,
                                activity: "prediction",
                                wchich_schedule: null,
                                status: "active_pending",
                                changed_at: new Date(),
                            };

                            const newdeviceSwitchingAccordingToDecisions =
                                await device_switching.create(
                                    deviceSwitchingAccordingToDecisions
                                );
                        })
                    );
                    const [relaySocketDeviceSwithResults, metadata] =
                        await db.query(`SELECT device_switchings.device_id, device_switchings.switch_status, devices.relay_unit_id, devices.socket FROM device_switchings, devices WHERE devices.room_id=${roomId} AND device_switchings.activity='prediction' AND device_switchings.status='active_pending' AND device_switchings.device_id = devices.device_id`);
                    let wsServerDataToSend = {};
                    try {
                        await Promise.all(
                            relaySocketDeviceSwithResults.map(
                                async (element) => {
                                    if (!wsServerDataToSend.hasOwnProperty(element.relay_unit_id)) {
                                        wsServerDataToSend[
                                            element.relay_unit_id
                                        ] = {};
                                    }
                                    wsServerDataToSend[element.relay_unit_id][element.socket] = element.switch_status;
                                }
                            )
                        );
                    } catch (error) {
                        throw new Error(
                            "Internal processing error" + error.message
                        );
                    }
                    console.log(wsServerDataToSend);

                    //? Last Stopped Here
                    let fillCount = 0;

                    let remainingRelays = [];
                    let doneRelays = [];

                    async function sendToWs(wsServerData, errorRepeatCount) {
                        let count = 0;

                        while (count < errorRepeatCount) {
                            try {
                                // const wsServerResponse = await axios.post("http://4.157.52.81:4001/relayswitch", wsServerData);
                                const wsServerResponse1 = await fetch('http://20.253.48.86:4001/relayswitch', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(wsServerData)
                                });
                                const wsServerResponse = await wsServerResponse1.json();
                                console.log("hello", JSON.stringify(wsServerResponse));
                                if (wsServerResponse1.status >= 200 && wsServerResponse1.status < 300 && _.isEmpty(wsServerResponse.notFoundRelays)) {
                                    try {
                                        const deviceSwitchChangeResultsAfterSwitchingActive =
                                            await device_switching.update(
                                                { status: "inactive" },
                                                {
                                                    where: {
                                                        device_id:
                                                            devicesIdsInnRoom,
                                                        status: "inactive_pending",
                                                    },
                                                }
                                            );
                                        console.log("deviceSwitchChangeResultsAfterSwitchingActive", deviceSwitchChangeResultsAfterSwitchingActive)

                                        const deviceSwitchChangeResultsAfterSwitchingInactive =
                                            await device_switching.update(
                                                { status: "active" },
                                                {
                                                    where: {
                                                        device_id:
                                                            devicesIdsInnRoom,
                                                        status: "active_pending",
                                                    },
                                                }
                                            );
                                        doneRelays.push(wsServerResponse.foundRelays);
                                        console.log("deviceSwitchChangeResultsAfterSwitchingInactive", deviceSwitchChangeResultsAfterSwitchingInactive)
                                        throw new Error("Operation Successful");
                                    } catch (error) {
                                        throw new Error(error.message);
                                    }
                                } else if (wsServerResponse1.status >= 200 && wsServerResponse1.status < 300) {
                                    doneRelays.push(wsServerResponse.foundRelays);
                                    if (fillCount <= 3) {
                                        try {
                                            const deciceIdList1 = async () => {
                                                wsServerResponse.foundRelays.map.set(async (element) => {
                                                    Object.entries(element).forEach(async ([key, value]) => {
                                                        Object.entries(value).forEach(async ([k, v]) => {
                                                            console.log("key", key);
                                                            return await device.findOne(
                                                                {
                                                                    attributes: ["device_id",],
                                                                    where: { relay_id: key, socket: k },
                                                                });
                                                        });
                                                    });
                                                });
                                            }
                                            const value1 = await deciceIdList1();
                                            const deviceSwitchChangeResultsAfterSwitchingActive =
                                                await device_switching.update(
                                                    { status: "inactive" },
                                                    {
                                                        where: {
                                                            device_id: value1,
                                                            status: "inactive_pending",
                                                        },
                                                    }
                                                );
                                            console.log("deviceSwitchChangeResultsAfterSwitchingActive", deviceSwitchChangeResultsAfterSwitchingActive)
                                            const deciceIdList2 = async () => {
                                                wsServerResponse.foundRelays.map.set(async (element) => {
                                                    Object.entries(element).forEach(async ([key, value]) => {
                                                        Object.entries(value).forEach(async ([k, v]) => {
                                                            console.log("key", key);
                                                            return await device.findOne({
                                                                attributes: ["device_id"],
                                                                where: {
                                                                    relay_id:
                                                                        key,
                                                                    socket: k,
                                                                },
                                                            });
                                                        });
                                                    });
                                                });
                                            }
                                            const value2 = await deciceIdList2();
                                            const deviceSwitchChangeResultsAfterSwitchingInactive =
                                                await device_switching.update(
                                                    { status: "active" },
                                                    {
                                                        where: {
                                                            device_id: value2,
                                                            status: "active_pending",
                                                        },
                                                    });
                                            console.log("deviceSwitchChangeResultsAfterSwitchingInactive", deviceSwitchChangeResultsAfterSwitchingInactive)


                                            async () => {
                                                await delay(500);
                                            };

                                            fillCount++;
                                            const constForReturnVal =
                                                await sendToWs(wsServerResponse.notFoundRelays, 3);
                                        } catch (error) {
                                            throw new Error(error.message);
                                        }
                                    } else {
                                        remainingRelays.push(wsServerResponse.notFoundRelays);
                                        console.log("wsServerResponse.notFoundRelays")

                                    }
                                } else {
                                    count++;
                                    async () => {
                                        await delay(500);
                                    };

                                    if (count === errorRepeatCount) {
                                        throw new Error(
                                            "hello error"
                                        );
                                        wsServerResponseCopy = wsServerResponse;
                                    }
                                }
                            } catch (error) {
                                return error.message;
                            }
                        }
                    }
                    const wsServerData = { switchingScheme: wsServerDataToSend };
                    throw new Error(await sendToWs(wsServerData, 10));
                } catch (error) {
                    console.log(error);
                    if (error.message === "hello error") {
                        try {
                            const deciceIdList3 = async () => {
                                wsServerResponseCopy.NotFoundRelays.map.set(async (element) => {
                                    Object.entries(element).forEach(async ([key, value]) => {
                                        Object.entries(value).forEach(async ([k, v]) => {
                                            console.log("key", key);
                                            return await device.findOne({
                                                attributes: ["device_id"],
                                                where: {
                                                    relay_id:
                                                        key,
                                                    socket: k,
                                                },
                                            });
                                        });
                                    });
                                });
                            }
                            const value3 = await deciceIdList3();
                            console.log(value3)
                            const deviceSwitchChangeResultsAfterInternalErrorActive =
                                await device_switching.update(
                                    { status: "active" },
                                    {
                                        where: {
                                            device_id: value3,
                                            status: "inactive_pending",
                                        },
                                    });
                            console.log("deviceSwitchChangeResultsAfterInternalErrorActive", deviceSwitchChangeResultsAfterInternalErrorActive)
                            const deciceIdList4 = async () => {
                                wsServerResponseCopy.
                                    NotFoundRelays
                                    .map.set(async (element) => {
                                        Object.entries(element).forEach(
                                            async ([key, value]) => {
                                                Object.entries(
                                                    value
                                                ).forEach(async ([k, v]) => {
                                                    console.log("key", key);
                                                    return await device.findOne({
                                                        attributes: ["device_id",],
                                                        where: { relay_id: key, socket: k },
                                                    });
                                                });
                                            });
                                    });
                            }
                            const value4 = await deciceIdList4();
                            console.log(value4)
                            const deviceSwitchDeleteResultsAfterInternalError =
                                await device_switching.destroy({
                                    where: {
                                        device_id: value4,
                                        status: "active_pending",
                                    },
                                });
                            console.log("deviceSwitchDeleteResultsAfterInternalError", deviceSwitchDeleteResultsAfterInternalError)


                            throw new Error(
                                "Switching Aborted due to internal error"
                            );
                        } catch (error) {
                            throw new Error(error.message);
                        }
                    }

                    throw new Error(error.message);
                }
            } else {
                throw new Error("Decision Invalid");
            }
        } else {
            throw new Error("Prediction Invalid");
        }
    } catch (error) {
        if (error.message === "Operation Successful") {
            res.status(200).send(error.message);
        } else {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
};

export const switchDevicesBySchedule = async (req, res) => {

    try{

        const {switchingScheme, scheduleId} = req.body;

        const devicesIdsInnRoom = await Object.keys(switchingScheme);
        


    const decisions = [switchingScheme];

    if (!_.isEmpty(decisions)) {
        try {
            // Define the forEach callback function as async
            await Promise.all(
                decisions.data.map(async (element) => {
                    const deviceToSwitchData =
                        await device_switching.findOne({
                            where: {
                                device_id: element.device_id,
                                status: "active",
                            },
                        });

                    if (!_.isNull(deviceToSwitchData)) {
                        const deviceToSwitch =
                            deviceToSwitchData.dataValues;
                        // const deviceToSwitch = decisions.data['device'];

                        if (!_.isEmpty(deviceToSwitch)) {
                            try {
                                // await Promise.all(deviceToSwitch.map(async (element)=>{
                                const deviceSwitchChangeResults =
                                    await device_switching.update(
                                        {
                                            status: "inactive_pending",
                                        },
                                        {
                                            where: {
                                                device_id:
                                                    deviceToSwitch.device_id,
                                                status: "active",
                                            },
                                        }
                                    );

                                if (
                                    _.isEmpty(deviceSwitchChangeResults)
                                ) {
                                    throw new Error(
                                        "Error while updating switching scheme"
                                    );
                                }
                                // }));
                            } catch (error) {
                                throw new Error(error.message);
                            }
                        }
                    }
                })
            );
        } catch (error) {
            // Handle any errors that occur during the await calls
            throw new Error(error.message);
        }

        let wsServerResponseCopy = {}
        try {
            await Promise.all(
                decisions.data.map(async (element) => {
                    let deviceSwitchingAccordingToDecisions = {
                        device_id: element.device_id,
                        switch_status: element.switch_status,
                        activity: "schedule",
                        wchich_schedule: [scheduleId],
                        status: "active_pending",
                        changed_at: new Date(),
                    };

                    const newdeviceSwitchingAccordingToDecisions =
                        await device_switching.create(
                            deviceSwitchingAccordingToDecisions
                        );
                })
            );
            const [relaySocketDeviceSwithResults, metadata] =
                await db.query(`SELECT device_switchings.device_id, device_switchings.switch_status, devices.relay_unit_id, devices.socket FROM device_switchings, devices WHERE devices.room_id=${roomId} AND device_switchings.activity='prediction' AND device_switchings.status='active_pending' AND device_switchings.device_id = devices.device_id`);
            let wsServerDataToSend = {};
            try {
                await Promise.all(
                    relaySocketDeviceSwithResults.map(
                        async (element) => {
                            if (!wsServerDataToSend.hasOwnProperty(element.relay_unit_id)) {
                                wsServerDataToSend[
                                    element.relay_unit_id
                                ] = {};
                            }
                            wsServerDataToSend[element.relay_unit_id][element.socket] = element.switch_status;
                        }
                    )
                );
            } catch (error) {
                throw new Error(
                    "Internal processing error" + error.message
                );
            }
            console.log(wsServerDataToSend);

            //? Last Stopped Here
            let fillCount = 0;

            let remainingRelays = [];
            let doneRelays = [];

            async function sendToWs(wsServerData, errorRepeatCount) {
                let count = 0;

                while (count < errorRepeatCount) {
                    try {
                        // const wsServerResponse = await axios.post("http://4.157.52.81:4001/relayswitch", wsServerData);
                        const wsServerResponse1 = await fetch('http://20.253.48.86:4001/relayswitch', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(wsServerData)
                        });
                        const wsServerResponse = await wsServerResponse1.json();
                        console.log("hello", JSON.stringify(wsServerResponse));
                        if (wsServerResponse1.status >= 200 && wsServerResponse1.status < 300 && _.isEmpty(wsServerResponse.notFoundRelays)) {
                            try {
                                const deviceSwitchChangeResultsAfterSwitchingActive =
                                    await device_switching.update(
                                        { status: "inactive" },
                                        {
                                            where: {
                                                device_id:
                                                    devicesIdsInnRoom,
                                                status: "inactive_pending",
                                            },
                                        }
                                    );
                                console.log("deviceSwitchChangeResultsAfterSwitchingActive", deviceSwitchChangeResultsAfterSwitchingActive)

                                const deviceSwitchChangeResultsAfterSwitchingInactive =
                                    await device_switching.update(
                                        { status: "active" },
                                        {
                                            where: {
                                                device_id:
                                                    devicesIdsInnRoom,
                                                status: "active_pending",
                                            },
                                        }
                                    );
                                doneRelays.push(wsServerResponse.foundRelays);
                                console.log("deviceSwitchChangeResultsAfterSwitchingInactive", deviceSwitchChangeResultsAfterSwitchingInactive)
                                throw new Error("Operation Successful");
                            } catch (error) {
                                throw new Error(error.message);
                            }
                        } else if (wsServerResponse1.status >= 200 && wsServerResponse1.status < 300) {
                            doneRelays.push(wsServerResponse.foundRelays);
                            if (fillCount <= 3) {
                                try {
                                    const deciceIdList1 = async () => {
                                        wsServerResponse.foundRelays.map.set(async (element) => {
                                            Object.entries(element).forEach(async ([key, value]) => {
                                                Object.entries(value).forEach(async ([k, v]) => {
                                                    console.log("key", key);
                                                    return await device.findOne(
                                                        {
                                                            attributes: ["device_id",],
                                                            where: { relay_id: key, socket: k },
                                                        });
                                                });
                                            });
                                        });
                                    }
                                    const value1 = await deciceIdList1();
                                    const deviceSwitchChangeResultsAfterSwitchingActive =
                                        await device_switching.update(
                                            { status: "inactive" },
                                            {
                                                where: {
                                                    device_id: value1,
                                                    status: "inactive_pending",
                                                },
                                            }
                                        );
                                    console.log("deviceSwitchChangeResultsAfterSwitchingActive", deviceSwitchChangeResultsAfterSwitchingActive)
                                    const deciceIdList2 = async () => {
                                        wsServerResponse.foundRelays.map.set(async (element) => {
                                            Object.entries(element).forEach(async ([key, value]) => {
                                                Object.entries(value).forEach(async ([k, v]) => {
                                                    console.log("key", key);
                                                    return await device.findOne({
                                                        attributes: ["device_id"],
                                                        where: {
                                                            relay_id:
                                                                key,
                                                            socket: k,
                                                        },
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    const value2 = await deciceIdList2();
                                    const deviceSwitchChangeResultsAfterSwitchingInactive =
                                        await device_switching.update(
                                            { status: "active" },
                                            {
                                                where: {
                                                    device_id: value2,
                                                    status: "active_pending",
                                                },
                                            });
                                    console.log("deviceSwitchChangeResultsAfterSwitchingInactive", deviceSwitchChangeResultsAfterSwitchingInactive)


                                    async () => {
                                        await delay(500);
                                    };

                                    fillCount++;
                                    const constForReturnVal =
                                        await sendToWs(wsServerResponse.notFoundRelays, 3);
                                } catch (error) {
                                    throw new Error(error.message);
                                }
                            } else {
                                remainingRelays.push(wsServerResponse.notFoundRelays);
                                console.log("wsServerResponse.notFoundRelays")

                            }
                        } else {
                            count++;
                            async () => {
                                await delay(500);
                            };

                            if (count === errorRepeatCount) {
                                throw new Error(
                                    "hello error"
                                );
                                wsServerResponseCopy = wsServerResponse;
                            }
                        }
                    } catch (error) {
                        return error.message;
                    }
                }
            }
            const wsServerData = { switchingScheme: wsServerDataToSend };
            throw new Error(await sendToWs(wsServerData, 10));
        } catch (error) {
            console.log(error);
            if (error.message === "hello error") {
                try {
                    const deciceIdList3 = async () => {
                        wsServerResponseCopy.NotFoundRelays.map.set(async (element) => {
                            Object.entries(element).forEach(async ([key, value]) => {
                                Object.entries(value).forEach(async ([k, v]) => {
                                    console.log("key", key);
                                    return await device.findOne({
                                        attributes: ["device_id"],
                                        where: {
                                            relay_id:
                                                key,
                                            socket: k,
                                        },
                                    });
                                });
                            });
                        });
                    }
                    const value3 = await deciceIdList3();
                    console.log(value3)
                    const deviceSwitchChangeResultsAfterInternalErrorActive =
                        await device_switching.update(
                            { status: "active" },
                            {
                                where: {
                                    device_id: value3,
                                    status: "inactive_pending",
                                },
                            });
                    console.log("deviceSwitchChangeResultsAfterInternalErrorActive", deviceSwitchChangeResultsAfterInternalErrorActive)
                    const deciceIdList4 = async () => {
                        wsServerResponseCopy.
                            NotFoundRelays
                            .map.set(async (element) => {
                                Object.entries(element).forEach(
                                    async ([key, value]) => {
                                        Object.entries(
                                            value
                                        ).forEach(async ([k, v]) => {
                                            console.log("key", key);
                                            return await device.findOne({
                                                attributes: ["device_id",],
                                                where: { relay_id: key, socket: k },
                                            });
                                        });
                                    });
                            });
                    }
                    const value4 = await deciceIdList4();
                    console.log(value4)
                    const deviceSwitchDeleteResultsAfterInternalError =
                        await device_switching.destroy({
                            where: {
                                device_id: value4,
                                status: "active_pending",
                            },
                        });
                    console.log("deviceSwitchDeleteResultsAfterInternalError", deviceSwitchDeleteResultsAfterInternalError)


                    throw new Error(
                        "Switching Aborted due to internal error"
                    );
                } catch (error) {
                    throw new Error(error.message);
                }
            }

            throw new Error(error.message);
        }
    } else {
        throw new Error("Decision Invalid");
    }
    }catch(error){
        if (error.message === "Operation Successful") {
            res.status(200).send(error.message);
        } else {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
}


export const switchDevicesManually = async (req, res) => {

    try{

        const {switchingScheme} = req.body;

        const devicesIdsInnRoom = await Object.keys(switchingScheme);
        


    const decisions = [switchingScheme];

    if (!_.isEmpty(decisions)) {
        try {
            // Define the forEach callback function as async
            await Promise.all(
                decisions.data.map(async (element) => {
                    const deviceToSwitchData =
                        await device_switching.findOne({
                            where: {
                                device_id: element.device_id,
                                status: "active",
                            },
                        });

                    if (!_.isNull(deviceToSwitchData)) {
                        const deviceToSwitch =
                            deviceToSwitchData.dataValues;
                        // const deviceToSwitch = decisions.data['device'];

                        if (!_.isEmpty(deviceToSwitch)) {
                            try {
                                // await Promise.all(deviceToSwitch.map(async (element)=>{
                                const deviceSwitchChangeResults =
                                    await device_switching.update(
                                        {
                                            status: "inactive_pending",
                                        },
                                        {
                                            where: {
                                                device_id:
                                                    deviceToSwitch.device_id,
                                                status: "active",
                                            },
                                        }
                                    );

                                if (
                                    _.isEmpty(deviceSwitchChangeResults)
                                ) {
                                    throw new Error(
                                        "Error while updating switching scheme"
                                    );
                                }
                                // }));
                            } catch (error) {
                                throw new Error(error.message);
                            }
                        }
                    }
                })
            );
        } catch (error) {
            // Handle any errors that occur during the await calls
            throw new Error(error.message);
        }

        let wsServerResponseCopy = {}
        try {
            await Promise.all(
                decisions.data.map(async (element) => {
                    let deviceSwitchingAccordingToDecisions = {
                        device_id: element.device_id,
                        switch_status: element.switch_status,
                        activity: "manual",
                        wchich_schedule: null,
                        status: "active_pending",
                        changed_at: new Date(),
                    };

                    const newdeviceSwitchingAccordingToDecisions =
                        await device_switching.create(
                            deviceSwitchingAccordingToDecisions
                        );
                })
            );
            const [relaySocketDeviceSwithResults, metadata] =
                await db.query(`SELECT device_switchings.device_id, device_switchings.switch_status, devices.relay_unit_id, devices.socket FROM device_switchings, devices WHERE devices.room_id=${roomId} AND device_switchings.activity='prediction' AND device_switchings.status='active_pending' AND device_switchings.device_id = devices.device_id`);
            let wsServerDataToSend = {};
            try {
                await Promise.all(
                    relaySocketDeviceSwithResults.map(
                        async (element) => {
                            if (!wsServerDataToSend.hasOwnProperty(element.relay_unit_id)) {
                                wsServerDataToSend[
                                    element.relay_unit_id
                                ] = {};
                            }
                            wsServerDataToSend[element.relay_unit_id][element.socket] = element.switch_status;
                        }
                    )
                );
            } catch (error) {
                throw new Error(
                    "Internal processing error" + error.message
                );
            }
            console.log(wsServerDataToSend);

            //? Last Stopped Here
            let fillCount = 0;

            let remainingRelays = [];
            let doneRelays = [];

            async function sendToWs(wsServerData, errorRepeatCount) {
                let count = 0;

                while (count < errorRepeatCount) {
                    try {
                        // const wsServerResponse = await axios.post("http://4.157.52.81:4001/relayswitch", wsServerData);
                        const wsServerResponse1 = await fetch('http://20.253.48.86:4001/relayswitch', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(wsServerData)
                        });
                        const wsServerResponse = await wsServerResponse1.json();
                        console.log("hello", JSON.stringify(wsServerResponse));
                        if (wsServerResponse1.status >= 200 && wsServerResponse1.status < 300 && _.isEmpty(wsServerResponse.notFoundRelays)) {
                            try {
                                const deviceSwitchChangeResultsAfterSwitchingActive =
                                    await device_switching.update(
                                        { status: "inactive" },
                                        {
                                            where: {
                                                device_id:
                                                    devicesIdsInnRoom,
                                                status: "inactive_pending",
                                            },
                                        }
                                    );
                                console.log("deviceSwitchChangeResultsAfterSwitchingActive", deviceSwitchChangeResultsAfterSwitchingActive)

                                const deviceSwitchChangeResultsAfterSwitchingInactive =
                                    await device_switching.update(
                                        { status: "active" },
                                        {
                                            where: {
                                                device_id:
                                                    devicesIdsInnRoom,
                                                status: "active_pending",
                                            },
                                        }
                                    );
                                doneRelays.push(wsServerResponse.foundRelays);
                                console.log("deviceSwitchChangeResultsAfterSwitchingInactive", deviceSwitchChangeResultsAfterSwitchingInactive)
                                throw new Error("Operation Successful");
                            } catch (error) {
                                throw new Error(error.message);
                            }
                        } else if (wsServerResponse1.status >= 200 && wsServerResponse1.status < 300) {
                            doneRelays.push(wsServerResponse.foundRelays);
                            if (fillCount <= 3) {
                                try {
                                    const deciceIdList1 = async () => {
                                        wsServerResponse.foundRelays.map.set(async (element) => {
                                            Object.entries(element).forEach(async ([key, value]) => {
                                                Object.entries(value).forEach(async ([k, v]) => {
                                                    console.log("key", key);
                                                    return await device.findOne(
                                                        {
                                                            attributes: ["device_id",],
                                                            where: { relay_id: key, socket: k },
                                                        });
                                                });
                                            });
                                        });
                                    }
                                    const value1 = await deciceIdList1();
                                    const deviceSwitchChangeResultsAfterSwitchingActive =
                                        await device_switching.update(
                                            { status: "inactive" },
                                            {
                                                where: {
                                                    device_id: value1,
                                                    status: "inactive_pending",
                                                },
                                            }
                                        );
                                    console.log("deviceSwitchChangeResultsAfterSwitchingActive", deviceSwitchChangeResultsAfterSwitchingActive)
                                    const deciceIdList2 = async () => {
                                        wsServerResponse.foundRelays.map.set(async (element) => {
                                            Object.entries(element).forEach(async ([key, value]) => {
                                                Object.entries(value).forEach(async ([k, v]) => {
                                                    console.log("key", key);
                                                    return await device.findOne({
                                                        attributes: ["device_id"],
                                                        where: {
                                                            relay_id:
                                                                key,
                                                            socket: k,
                                                        },
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    const value2 = await deciceIdList2();
                                    const deviceSwitchChangeResultsAfterSwitchingInactive =
                                        await device_switching.update(
                                            { status: "active" },
                                            {
                                                where: {
                                                    device_id: value2,
                                                    status: "active_pending",
                                                },
                                            });
                                    console.log("deviceSwitchChangeResultsAfterSwitchingInactive", deviceSwitchChangeResultsAfterSwitchingInactive)


                                    async () => {
                                        await delay(500);
                                    };

                                    fillCount++;
                                    const constForReturnVal =
                                        await sendToWs(wsServerResponse.notFoundRelays, 3);
                                } catch (error) {
                                    throw new Error(error.message);
                                }
                            } else {
                                remainingRelays.push(wsServerResponse.notFoundRelays);
                                console.log("wsServerResponse.notFoundRelays")

                            }
                        } else {
                            count++;
                            async () => {
                                await delay(500);
                            };

                            if (count === errorRepeatCount) {
                                throw new Error(
                                    "hello error"
                                );
                                wsServerResponseCopy = wsServerResponse;
                            }
                        }
                    } catch (error) {
                        return error.message;
                    }
                }
            }
            const wsServerData = { switchingScheme: wsServerDataToSend };
            throw new Error(await sendToWs(wsServerData, 10));
        } catch (error) {
            console.log(error);
            if (error.message === "hello error") {
                try {
                    const deciceIdList3 = async () => {
                        wsServerResponseCopy.NotFoundRelays.map.set(async (element) => {
                            Object.entries(element).forEach(async ([key, value]) => {
                                Object.entries(value).forEach(async ([k, v]) => {
                                    console.log("key", key);
                                    return await device.findOne({
                                        attributes: ["device_id"],
                                        where: {
                                            relay_id:
                                                key,
                                            socket: k,
                                        },
                                    });
                                });
                            });
                        });
                    }
                    const value3 = await deciceIdList3();
                    console.log(value3)
                    const deviceSwitchChangeResultsAfterInternalErrorActive =
                        await device_switching.update(
                            { status: "active" },
                            {
                                where: {
                                    device_id: value3,
                                    status: "inactive_pending",
                                },
                            });
                    console.log("deviceSwitchChangeResultsAfterInternalErrorActive", deviceSwitchChangeResultsAfterInternalErrorActive)
                    const deciceIdList4 = async () => {
                        wsServerResponseCopy.
                            NotFoundRelays
                            .map.set(async (element) => {
                                Object.entries(element).forEach(
                                    async ([key, value]) => {
                                        Object.entries(
                                            value
                                        ).forEach(async ([k, v]) => {
                                            console.log("key", key);
                                            return await device.findOne({
                                                attributes: ["device_id",],
                                                where: { relay_id: key, socket: k },
                                            });
                                        });
                                    });
                            });
                    }
                    const value4 = await deciceIdList4();
                    console.log(value4)
                    const deviceSwitchDeleteResultsAfterInternalError =
                        await device_switching.destroy({
                            where: {
                                device_id: value4,
                                status: "active_pending",
                            },
                        });
                    console.log("deviceSwitchDeleteResultsAfterInternalError", deviceSwitchDeleteResultsAfterInternalError)


                    throw new Error(
                        "Switching Aborted due to internal error"
                    );
                } catch (error) {
                    throw new Error(error.message);
                }
            }

            throw new Error(error.message);
        }
    } else {
        throw new Error("Decision Invalid");
    }
    }catch(error){
        if (error.message === "Operation Successful") {
            res.status(200).send(error.message);
        } else {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
}

/*
{
    2578:{
        0: true
        1: true
        .
        .
        .
        .
        .
        .
        7: false
    },
    3534: {

    },
    1243: {

    }
}
*/


