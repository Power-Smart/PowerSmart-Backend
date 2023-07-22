import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Chat = db.define("chat", {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

export default Chat;