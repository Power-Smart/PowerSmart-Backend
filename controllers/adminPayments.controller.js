import Payment from "../models/payment.model.js";

export const getPaymentsView = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            order: [['payment_id', 'ASC']],
        });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
