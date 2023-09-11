import db from "../models/index.js";
import { DataTypes } from "sequelize";

const CustomerServiceRequest = db.define("customer_service_request", {
    service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    assign_tech_support_id: {
        type: DataTypes.INTEGER,    
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_repaired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default CustomerServiceRequest;