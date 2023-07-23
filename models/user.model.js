import db from "../models/index.js";
import { DataTypes } from "sequelize";

const User = db.define("user", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            isIn: [[1, 2, 3, 4, 5]],
        },
    },
});

export default User;
