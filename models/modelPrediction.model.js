import db from "./index.js";
import { DataTypes } from "sequelize";

const ModelPrediction = db.define("model_prediction", {
    room_id: {
        type: DataTypes.INTEGER,
    },
    occupancy_rate: {
        type: DataTypes.STRING,
    },
    room_status: {
        type: DataTypes.STRING,
    },
    sent_time: {
        type: DataTypes.DATE,
    },
    recieve_time: {
        type: DataTypes.DATE,
    },
});

export default ModelPrediction;
