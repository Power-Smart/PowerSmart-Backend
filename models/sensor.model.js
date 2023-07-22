import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Sensor = db.define("sensor", {
    sensor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    sensor_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

export default Sensor;
