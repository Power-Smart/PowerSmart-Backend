import axios from "axios";
import dotenv from 'dotenv';
import Notification from "../models/notification.model.js";
dotenv.config();

const socket_server = process.env.SOCKET_IO_SERVER_ADDRESS;

export const notify = async (sender_id, receiver_id, title, message, type = 'General') => {
    try {
        await Notification.create({
            title,
            message,
            type,
            sender_id,
            receiver_id,
            status: 'U',
        });
        const res = await axios.post(`${socket_server}/notify`, {
            receiverID: receiver_id,
            title,
            message,
        });
        return { db: true, socket: res.status !== 200 };
    }
    catch (error) {
        return { db: false, socket: false };
    }
};