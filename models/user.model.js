import db from "../models/index.js";
import { DataTypes } from "sequelize";

const User = db.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
});

export default User;
