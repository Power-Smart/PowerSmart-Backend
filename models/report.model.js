import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Report = db.define("reports", {
    report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
    },
});

export default Report;
