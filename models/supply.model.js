import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Supply = db.define("supply", {
    stock_order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    items: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

export default Supply;
