import db from "../models/index.js";   
import { DataTypes } from "sequelize";

const Chat = db.define("chat", {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

export default Chat;