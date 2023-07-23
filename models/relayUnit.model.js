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
    category: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    place_id: {
        type: DataTypes.INTEGER,
    },

});

export default RelayUnit;