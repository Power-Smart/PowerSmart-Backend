import db from "../models/index.js";
import { DataTypes } from "sequelize";

const RelayUnit = db.define("relay_unit", {
    relay_unit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    category: {
        type: DataTypes.CHAR(1),
    },
    status: {
        type: DataTypes.STRING,
    },
    place_id: {
        type: DataTypes.INTEGER,
    },
});

export default RelayUnit;
