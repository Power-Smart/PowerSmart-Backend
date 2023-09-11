import db from "./index.js";
import { DataTypes } from "sequelize";

const TechSupportPlace = db.define("tech_support_place", {
    tech_support_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "tech_supports",
            key: "user_id",
        },
    },
    place_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "places",
            key: "place_id",
        },
    },
    access_type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

export default TechSupportPlace;
