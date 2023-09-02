import { get_sse_client } from "../config/sse.config.js";
import SensorData from "../models/sensorData.model.js";

export const sendSensorDara = async (req, res) => {
    const { user_id, sensor_unit_id } = req.params;

    const sse_client = get_sse_client(user_id);
    if (sse_client) {
        const sensorData = await SensorData.findOne({ where: { sensor_unit_id } });
        sse_client.write(`data:${JSON.stringify(sensorData.dataValues)}\n\n`);
    }
};