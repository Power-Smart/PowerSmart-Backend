import Order from "../models/order.model.js";
import Item from "../models/item.model.js";
import dotenv from "dotenv";
import crypto from "crypto-js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
dotenv.config();

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

export const checkoutPayment = async (req, res) => {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
    const hash = createHash(merchant_id, order_id, payhere_amount, payhere_currency);

    if (hash === md5sig && status_code === 2) {
        //  update payment in tables
    }
}

export const getBillDetails = async (req, res) => {
    const { cusId } = req.params;

    try {
        const orders = await Order.findAll({
            where: {
                customer_id: cusId,
                is_paid: false,
                payment_id: null
            },
            include: {
                model: Item,
                as: 'item',
                attributes: ['name', 'price']
            },
            attributes: {
                exclude: ["updatedAt", "createdAt", "tech_support_id", "customer_id", "order_date"]
            }
        });
        const userData = await Customer.findOne({
            where: {
                user_id: cusId
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['first_name', 'last_name', 'email']
            },
            attributes: ['user_id', 'tel_no', 'address']
        });
        const totalBill = orders.reduce((acc, item) => acc + item.dataValues.quantity * item.dataValues.item.price, 0)
        res.status(200).json({ totalBill, userData });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


function createHash(merchant_id, order_id, amount, currency) {
    const merchant_secret = process.env.MERCHANT_SECRET;
    const hashed_secret = crypto.MD5(merchant_secret).toString().toUpperCase();
    let amountFormated = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');
    let hash = crypto.MD5(merchant_id + order_id + amountFormated + currency + hashed_secret).toString().toUpperCase();
    return hash;
}