import dotenv from "dotenv";
import device from "../models/device.model.js";
import model_predictions from "../models/modelPrediction.model.js";
import sensor_unit from "../models/sensorUnit.model.js";
import device_switching from "../models/deviceSwitching.model.js";
import room from "../models/room.model.js";
import Place from "../models/place.model.js";
import Schedule from "../models/schedule.model.js";
import axios from "axios";
import db from "../models/index.js";
import _ from "lodash";
import DeviceSchedule from "../models/deviceSchedule.model.js";
dotenv.config();

const cronServer = process.env.CRON_SERVER;
const ISL = "internal server error";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getSchedules = async (req, res) => {
    try {
        const { userId, deviceId } = req.params;
        const allSchedules = await DeviceSchedule.findAll({
            attributes: {
                exclude: ["device_id", "createdAt", "updatedAt"],
            },
            include: {
                model: Schedule,
                as: "schedule",
                attributes: {
                    exclude: [
                        "schedule_id",
                        "place_id",
                        "createdAt",
                        "updatedAt",
                        "schedule_id",
                    ],
                },
            },
            where: {
                device_id: deviceId,
            },
        });
        const schedules = allSchedules.filter(schedule => +schedule.dataValues.schedule.user_id === +userId);
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const createSchedule = async (req, res) => {
    try {
        const { userId } = req.params;
        if (_.isNull(req.body) || _.isEmpty(req.body)) {
            throw new Error("Cannot process. Empty body");
        }
        const {
            name,
            switch_status,
            status,
            startTime,
            endTime,
            startDay,
            endDay,
            automationOverride,
            manualOverride,
            scheduleOverride,
            placeId,
            deviceID
        } = req.body;

        const deviceDetails = {
            [deviceID]: switch_status,
        }

        const scheduleDetailsArr = {
            name,
            status,
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
        const newScheduleId = newSchedule.dataValues.schedule_id;

        const deviceScheduleInsertResult = await DeviceSchedule.create({
            device_id: deviceID,
            schedule_id: newScheduleId,
            switch_status
        });

        const placeTimeZoneResult = await Place.findOne({
            attributes: ['time_zone'],
            where: {
                place_id: placeId
            }
        });

        const placeTimeZone = placeTimeZoneResult.dataValues.time_zone;

        const cronServerUrl = `${cronServer}/create`;

        const requestData = {
            scheduleId: newScheduleId,
            startTime,
            endTime,
            startDay: ((day) => (day === 'mon' ? 1 : day === 'tue' ? 2 : day === 'wed' ? 3 : day === 'thu' ? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(startDay),
            endDay: ((day) => (day === 'mon' ? 1 : day === 'tue' ? 2 : day === 'wed' ? 3 : day === 'thu' ? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(endDay),
            switchingScheme: deviceDetails,
            timeZone: placeTimeZone
        };

        const responseData = {
            ...deviceScheduleInsertResult.dataValues,
            schedule: newSchedule.dataValues
        }
        axios.post(cronServerUrl, requestData).then(
            (response) => {
                console.log(response.data);
                res.status(200).json(responseData);
            })
            .catch(async (error) => {
                console.log(error);
                await DeviceSchedule.destroy({
                    where: {
                        schedule_id: newScheduleId
                    }
                });
                await Schedule.destroy({
                    where: {
                        schedule_id: newScheduleId
                    }
                });
                throw new Error(ISL);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export const deleteSchedule = async (req, res) => {

    try {
        const { userId, scheduleId } = req.params;

        const requestData = { scheduleId };

        const cronServerUrl = `${cronServer}/delete`;

        axios.post(cronServerUrl, requestData).then(async (response) => {
            if (response.status === 200) {
                await DeviceSchedule.destroy({
                    where: {
                        schedule_id: scheduleId
                    }
                });
                await Schedule.destroy({
                    where: {
                        schedule_id: scheduleId
                    }
                });
                console.log(response.data);
                res.status(200).json(response.data);
            } else {
                throw new Error("Cron server error");
            }
        }
        ).catch(
            (error) => {
                res.status(500).json(error.message);
            }
        );
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const updateSchedule = async (req, res) => {

    try {

        const { scheduleDetails, deviceDetails } = req.body

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
        } = scheduleDetails;

        const scheduleDetailsArr = {
            schedule_id: sceduleId,
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
            startDay: ((day) => (day === 'mon' ? 1 : day === 'tue' ? 2 : day === 'wed' ? 3 : day === 'thu' ? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(startDay),
            endDay: ((day) => (day === 'mon' ? 1 : day === 'tue' ? 2 : day === 'wed' ? 3 : day === 'thu' ? 4 : day === 'fri' ? 5 : day === 'sat' ? 6 : 7))(endDay),
            switchingScheme: deviceDetails,
            timeZone: placeTimeZone
        };


        axios.post(cronServerUrl, requestData).then(
            (response) => {
                console.log(response);

                const deviceScheduleIDeleteResult = DeviceSchedule.destroy({
                    where: {
                        schedule_id: scheduleId
                    }
                });

                const sheduleIDeleteResult = Schedule.destroy({
                    where: {
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



    } catch (error) {
        res.status(500).json(error.message);
    }
}