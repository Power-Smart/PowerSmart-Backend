import db from "../models/index.js";
import { DataTypes } from "sequelize";

const GuestUserSuggest = db.define("guest_user_suggest", {
    suggest_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    place_id: {
        type: DataTypes.INTEGER,
    },
    room_id: {
        type: DataTypes.INTEGER,
    },
    suggest_description: {
        type: DataTypes.STRING,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

});

export default GuestUserSuggest;