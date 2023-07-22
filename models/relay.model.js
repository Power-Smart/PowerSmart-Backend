import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Relay = db.define("relay", {
    relay_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    relay_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

export default Relay;