import db from "../models/index.js";
import { DataTypes } from "sequelize";


const Supplier = db.define("supplier", {
    supplier_id: {
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
    tel_no: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    items: {
        type: DataTypes.ARRAY(DataTypes.JSON),
    },

});

export default Supplier;