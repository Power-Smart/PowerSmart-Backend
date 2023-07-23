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
    category: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    schedule_id: {
        type: DataTypes.INTEGER,
    }

});

export default Device;








    // schedule_id: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: "device_schedules",
    //         key: "schedule_id",
    //     },
    // },