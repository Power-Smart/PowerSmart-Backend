import db from "./index.js";   
import { DataTypes } from "sequelize";

const DeviceSchedule = db.define("device_schedule", {
    schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    switch_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
    },

});

export default DeviceSchedule;