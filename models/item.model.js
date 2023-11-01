import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Item = db.define("item", {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    item_code: { 
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Item;
