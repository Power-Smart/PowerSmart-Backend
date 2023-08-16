import Order from "../models/order.model.js";
import Item from "../models/item.model.js";

export const getOrdersForCustomer = async (req, res) => {
    const { cusId } = req.params;
    try {
        const orders = await Order.findAll({
            where: {
                customer_id: cusId,
                is_paid: false,
            },
        });
        const items = await Item.findAll({
            where: {
                item_id: orders.map((router) => router.dataValues.item_id),
            },
            attributes: ["item_id", "name", "price"],
        });
        orders.forEach((order) => {
            const item = items.find(
                (item) => item.dataValues.item_id === order.dataValues.item_id
            );
            order.dataValues.item = { name: item.name, price: item.price };
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getOrdersForTechSupport = async (req, res) => {
    const { tchID } = req.params;
    try {
        const orders = await Order.findAll({
            where: {
                tech_support_id: tchID,
                is_paid: false,
            },
        });
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
    const { orders } = req.body;
    try {
        orders.forEach(async (order) => {
            await Order.create({
                customer_id: order.customer_id,
                tech_support_id: order.tech_support_id,
                place_id: order.place_id,
                is_paid: false,
                order_date: new Date().toISOString(),
                item_id: order.item_id,
                quantity: order.quantity,
            });
        });
        res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
