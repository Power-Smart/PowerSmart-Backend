import Express from 'express';
import { getAllNotifications, getFilteredNotifications } from '../controllers/notifications.controller.js';

const router = Express.Router();

router.get('/getNotifications/:userID/:type', getFilteredNotifications);
router.get('/getNotifications/:userID', getAllNotifications);

export default router;
