import db from "./index.js";
import { DataTypes } from "sequelize";

const ModelPrediction = db.define("model_predictions", {
    room_id: {
        type: DataTypes.INTEGER,
    },
    occupancy_rate: {
        type: DataTypes.VARCHAR,
    },
    room_status: {
        type: DataTypes.VARCHAR,
    }
});

export default ModelPrediction;