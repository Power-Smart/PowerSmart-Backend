import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Marketplace = db.define("marketplace", {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    is_build_in_package: {
        type: DataTypes.BOOLEAN,
    },
});

export default Marketplace;