import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Payment = db.define("payment", {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    payhere_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "LKR",
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Payment;