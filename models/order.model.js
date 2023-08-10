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
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

export default Order;