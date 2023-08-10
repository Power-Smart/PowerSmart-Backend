import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Message = db.define("message", {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    is_seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Message;