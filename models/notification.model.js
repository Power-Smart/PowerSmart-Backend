import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Notification = db.define("notification", {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        defaultValue: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: 'U', // means unread
    },
    sender_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: "user_id"
        },
        allowNull: true
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: "user_id"
        },
        allowNull: false
    }
});

export default Notification;
