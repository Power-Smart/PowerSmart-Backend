import db from "../models/index.js";
import { DataTypes } from "sequelize";

const Admin = db.define("admin", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    tel_no: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
});

export default Admin;
