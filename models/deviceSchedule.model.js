import db from "./index.js";   
import { DataTypes } from "sequelize";

const DeviceSchedule = db.define("device_schedule", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    device_id: {
        type: DataTypes.INTEGER,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
    },
    switch_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

});

export default DeviceSchedule;