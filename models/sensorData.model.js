import db from "../models/index.js";
import { DataTypes } from "sequelize";

const SensorData = db.define("sensor_data", {
    sensor_unit_id: {
        type: DataTypes.INTEGER,
    },
    co2_level: {
        type:DataTypes.FLOAT,
    },
    hummidity_level: {
        type:DataTypes.FLOAT,
    },
    temperature: {
        type:DataTypes.FLOAT,
    },
    light_intensity: {
        type:DataTypes.FLOAT,
    },
    pir_reading: {
        type:DataTypes.BOOLEAN,
    }
});

export default SensorData;