import { CONNREFUSED } from "dns";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getAllNotifications = async (req, res) => {
    try {
        const { userID } = req.params;
        const notifications = await Notification.findAll({
            where: {
                receiver_id: userID,
                status: ['U', 'R']
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
        res.status(200).json(notifications);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e });
    }
}

export const getFilteredNotifications = async (req, res) => {
    try {
        const { userID, status } = req.params;
        const notifications = await Notification.findAll({
            where: {
                receiver_id: userID,
                status
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
        res.status(200).json(notifications);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e });
    }
}

export const updateNotificationStatus = async (req, res) => {
    try {
        const { notificationID } = req.params;
        const { status } = req.body;
        const notification = await Notification.update({
            status
        }, {
            where: {
                notification_id: notificationID
            }
        });
        res.status(200).json(notification);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e });
    }
}