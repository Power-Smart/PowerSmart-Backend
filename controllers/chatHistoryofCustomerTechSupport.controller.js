import Chat from "../models/chat.model.js";


export const getChatHistoryOfCustomerTechSupportSenderMsg = async (req, res) => {
    try {
        const customerID = parseInt(req.params.customerID);
        const techSupportID = parseInt(req.params.techSupportID);

        console.log(customerID, techSupportID);

        const chatHistory = await Chat.findAll({
            where: {
                sender_id: customerID,
                receiver_id: techSupportID,
            }
        });
        res.status(200).json(chatHistory);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChatHistoryOfCustomerTechSupportReceiverMsg = async (req, res) => {
    try {
        const customerID = parseInt(req.params.customerID);
        const techSupportID = parseInt(req.params.techSupportID);

        console.log(customerID, techSupportID);

        const chatHistory = await Chat.findAll({
            where: {
                sender_id: techSupportID,
                receiver_id: customerID,
            }
        });
        res.status(200).json(chatHistory);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

