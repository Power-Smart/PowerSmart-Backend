import Express from 'express';
import { sendPlaceSensorData, getRoomStatus } from '../controllers/sensorData.controller.js';
import { sse_middleware } from '../config/sse.config.js';

const router = Express.Router();

// router.get('/data/:user_id/:place_id', sse_middleware, sendSensorDara);
router.get(`/places/data/:user_id`, sse_middleware, sendPlaceSensorData);
router.get(`/rooms/data/:room_id`, getRoomStatus);

export default router;  