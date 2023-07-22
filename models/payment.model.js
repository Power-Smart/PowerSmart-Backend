import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Payment = db.define("payment", {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    amount : {
        type: DataTypes.INTEGER,
        allowNull: false,
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