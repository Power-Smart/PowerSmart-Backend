import db from "./index.js";
import { DataTypes } from "sequelize";

const InformUsage = db.define("inform_usage", {
    guest_id: {
        type: DataTypes.INTEGER,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.STRING,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    
});

export default InformUsage;