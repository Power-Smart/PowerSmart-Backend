import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Item = db.define("item", {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
    item_img: {
        type: DataTypes.STRING,
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

export default Item;