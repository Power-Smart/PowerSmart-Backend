import db from "../models/index.js";
import { DataTypes } from "sequelize";

const TechSupportRating = db.define("tech_support_rating", {
    rating_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    tech_support_id: {
        type: DataTypes.INTEGER,
    },
    rating: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING,
    },
});

export default TechSupportRating;