import db from "./index.js";
import { DataTypes } from "sequelize";

const customerOrderRequest = db.define("customer_order_request", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tech_support_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    num_of_places: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    num_of_rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    num_of_devices: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    order_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

});

export default customerOrderRequest;
