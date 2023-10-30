import { CONNREFUSED } from "dns";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getAllNotifications = async (req, res) => {
    try {
        const { userID } = req.params;
        const notifications = await Notification.findAll({
            where: {
                receiver_id: userID
            }
        });
        res.status(200).json(notifications);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e });
    }
}

export const getFilteredNotifications = async (req, res) => {
    try {
        const { userID, type } = req.params;
        const notifications = await Notification.findAll({
            where: {
                receiver_id: userID,
                type: type
            }
        });
        res.status(200).json(notifications);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e });
    }
}