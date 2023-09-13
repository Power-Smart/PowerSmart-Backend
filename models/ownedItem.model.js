import db from "../models/index.js";
import { DataTypes } from "sequelize";

const OwnedItem = db.define("owned_item", {
    customer_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
            model: "customers",
            key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    relay_units: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    sensor_units: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

export default OwnedItem;