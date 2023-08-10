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
    access_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

export default CustomerPlace;
