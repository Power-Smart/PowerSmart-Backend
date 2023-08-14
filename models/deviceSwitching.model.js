import db from "../models/index.js";
import { DataTypes } from "sequelize";

const DeviceSwitching = db.define("device_switching", {
    device_id: {
        type: DataTypes.INTEGER,
    },
    switch_status: {
        type: DataTypes.BOOLEAN,
    },
    activity: {
        type: DataTypes.STRING,
    },
    which_schedule: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "schedules",
            key: "schedule_id",
        },
    },
    status: {
        type: DataTypes.STRING,
    },
});

export default DeviceSwitching;
