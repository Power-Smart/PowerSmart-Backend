import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Place = db.define("place", {
    place_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    time_zone: {
        type: DataTypes.INTEGER,
    },
    place_type: {
        type: DataTypes.STRING,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

export default Place;
