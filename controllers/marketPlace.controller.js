import MarketPlace from "../models/marketPlace.model.js";
import Order from "../models/order.model.js";

export const getMarketPlaceItems = async (req, res) => {
    try {
        const items = await MarketPlace.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const sendCustomerPaymentSummaryApi = async (req, res) => {
    console.log(req.body)

    const { customerID, techSupportId } = req.body;

    console.log(req.body[0].item_id, req.body[0].quantity, customerID, techSupportId)

    try {
        const items = await Order.create({
            item_id: req.body[0].item_id,
            quantity: req.body[0].quantity,
            customer_id: customerID,
            tech_support_id: techSupportId,
            is_paid: false,
            place_id: 1,
        });
        console.log(items)
        res.status(200).json(items);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}