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
    place_id:{
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
    assign_tech_support_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_tech_support_assigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    is_order_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },

});

export default customerOrderRequest;
