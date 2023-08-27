import db from "./index.js";
import { DataTypes } from "sequelize";

const TechSupport = db.define("tech_support", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    profile_pic: {
        type: DataTypes.STRING,
    },
    tel_no: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
    },
    is_banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    customers: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
        allowNull: true,
    },
});

export default TechSupport;
