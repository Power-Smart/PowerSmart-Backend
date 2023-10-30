import Express from 'express';
import { getAllNotifications, getFilteredNotifications, updateNotificationStatus } from '../controllers/notifications.controller.js';

const router = Express.Router();

router.get('/getNotifications/:userID/:status', getFilteredNotifications);
router.get('/getNotifications/:userID', getAllNotifications);
router.put('/updateStatus/:notificationID', updateNotificationStatus);

export default router;
