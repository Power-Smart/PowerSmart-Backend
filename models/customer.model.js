import db from "../models/index.js";
import { DataTypes } from "sequelize";


const Customer = db.define("customer", {
    customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tel_no: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    year_subscription: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    achievements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
});

export default Customer;
