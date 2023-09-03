import Express from 'express';
import { sendPlaceSensorData } from '../controllers/sensorData.controller.js';
import { sse_middleware } from '../config/sse.config.js';

const router = Express.Router();

// router.get('/data/:user_id/:place_id', sse_middleware, sendSensorDara);
router.get(`/places/data/:user_id`, sse_middleware, sendPlaceSensorData);

export default router;  