import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Device = db.define("device", {
    device_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    type: {
        type: DataTypes.STRING,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
    },
    socket: {
        type: DataTypes.INTEGER,
    },
    room_id: {
        type: DataTypes.INTEGER,
    },
    relay_unit_id: {
        type: DataTypes.INTEGER,
    },
});

export default Device;
