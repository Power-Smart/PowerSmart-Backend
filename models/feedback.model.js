import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Feedback = db.define("feedback", {
    feedback_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Feedback;
