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
    which_schedue: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING
    },
});

export default DeviceSwitching;