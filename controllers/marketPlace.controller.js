import customerOrderRequest from "../models/customerOrderRequest.model.js";
import Order from "../models/order.model.js";
import TechSupportPlace from "../models/techSupportPlace.model.js";
import MarketPlace from "../models/marketplace.model.js";
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
    // console.log(req.body)

    const { customerID, techSupportID, customerCartItems, orderID } = req.body;

    // console.log(customerCartItems)
    // res.status(200).json(customerCartItems);
    try {
        const reqData = await customerOrderRequest.findOne({
            where: {
                order_id: orderID,
            },
        });
        const results = customerCartItems.map(async (item) => {
            const items = await Order.create({
                item_id: item.item_id,
                quantity: item.quantity,
                customer_id: customerID,
                tech_support_id: techSupportID,
                is_paid: false,
                place_id: reqData.dataValues.place_id,

            });
            return items
        })
        const res = await Promise.all(results)
        customerOrderRequest.update({
            is_order_completed: true,
        }, {
            where: {
                order_id: orderID,
            },
        });
        const techPlace = await TechSupportPlace.create({
            tech_support_id: techSupportID,
            place_id: reqData.dataValues.place_id,
            access_type: 0,
        });
        console.log(res)
        res.status(200).json(res);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

