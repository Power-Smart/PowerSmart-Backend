import db from "../models/index.js";
import { DataTypes } from "sequelize";

const GuestUser = db.define("guest_user", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    guest_name: {
        type: DataTypes.STRING,
    },
    guest_profile_pic: {
        type: DataTypes.STRING,
    },
    guest_email: {
        type: DataTypes.STRING,
        // unique: true,
    },
    is_ban: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default GuestUser;
