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
    location: {
        type: DataTypes.STRING,
    },
    postal_Code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

export default Place;
