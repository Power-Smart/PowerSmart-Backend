import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Schedule = db.define("schedule", {
    schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },

});

export default Schedule;