import db from "../models/index.js";
import { DataTypes } from "sequelize";

const CustomerPlace = db.define("customer_place", {
    place_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

export default CustomerPlace;
