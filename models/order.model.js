import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Order = db.define("order", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    is_paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    place_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tech_support_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "tech_supports",
            key: "user_id",
        },
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "customers",
            key: "user_id",
        },
    },
});

export default Order;
