import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Schedule = db.define("schedule", {
    schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN,
    },
    start_time: {
        type: DataTypes.DATE,
        timezone: true,
    },
    end_time: {
        type: DataTypes.DATE,
        timezone: true,
    },
    start_day: {
        type: DataTypes.CHAR(3),
    },
    end_day: {
        type: DataTypes.CHAR(3),
    },
    automation_override: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    manual_override: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    schedule_override: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    place_id: {
        type: DataTypes.INTEGER,
    },
});

export default Schedule;
