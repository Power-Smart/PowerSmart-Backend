import db from "../models/index.js";
import { DataTypes } from "sequelize";

const SensorUnit = db.define("sensor_unit", {
    sensor_unit_id: {
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
    category: {
        type: DataTypes.STRING,
    },
    room_id: {
        type: DataTypes.INTEGER,
    },

});

export default SensorUnit;