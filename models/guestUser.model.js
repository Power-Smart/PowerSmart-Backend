import db from "../models/index.js";
import { DataTypes } from "sequelize";

const GuestUser = db.define("guest_user", {
    guest_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    suggest: {
        type: DataTypes.STRING,
    },
    is_accept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    }
});

export default GuestUser;
