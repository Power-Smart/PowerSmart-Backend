import db from "../models/index.js";
import { DataTypes } from "sequelize";

const GuestUser = db.define("guest_user", {
    guest_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
    },
    is_banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default GuestUser;
