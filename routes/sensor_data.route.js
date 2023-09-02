import Express from 'express';
import { sendSensorDara } from '../controllers/sensorData.controller.js';
import { sse_middleware } from '../config/sse.config.js';

const router = Express.Router();

router.get('/data/:user_id/:sensor_unit_id', sse_middleware, sendSensorDara);

export default router;  