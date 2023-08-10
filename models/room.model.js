import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Room = db.define("room", {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    window_type: {
        type: DataTypes.STRING,
    },
    // room_type:{
    //     type: DataTypes.STRING,
    // },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    size: {
        type: DataTypes.INTEGER,
    },

    type: {
        type: DataTypes.STRING,
    },
    place_id: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
});

export default Room;
