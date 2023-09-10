import Order from "../models/order.model.js";
import Item from "../models/item.model.js";
import dotenv from "dotenv";
import crypto from "crypto-js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import qs from "querystring";
import Payment from "../models/payment.model.js";
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
    const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig, custom_1, custom_2, method } = req.body;
    const hash = createHash(merchant_id, order_id, payhere_amount, payhere_currency, status_code);
    const places = custom_1.split(',');
    if (hash === md5sig && +status_code === 2) {
        if (encryptPlaceDetails(places) === custom_2) {
            try {
                const newPayment = await Payment.create({
                    payhere_id: payment_id,
                    method,
                    amount: payhere_amount,
                    currency: payhere_currency,
                    type: "customer",
                    status: "success",
                    user_id: +order_id,
                });
                await Order.update({
                    is_paid: true,
                    payment_id: newPayment.payment_id
                }, {
                    where: {
                        customer_id: +order_id,
                        is_paid: false,
                        payment_id: null,
                        place_id: places
                    }
                });
                res.status(200).send();
            } catch (error) {
                console.log(error);
                res.status(500).send();
            }
        } else {
            try {
                const newPayment = await Payment.create({
                    payhere_id: payment_id,
                    method,
                    amount: payhere_amount,
                    currency: payhere_currency,
                    type: "customer",
                    status: "unauthorized",
                    user_id: +order_id,
                });
                res.status(403).send();
            } catch (error) {
                console.log(error);
                res.status(500).send();
            }
        }
    }
    else {
        console.log('payment failed');
        res.status(500).send();
    }
}

export const getUserDetails = async (req, res) => {
    const { cusId } = req.params;

    try {
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
        res.status(200).json({ userData });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const calTotal = async (req, res) => {
    const { cusId } = req.params;
    const { checkedList } = req.body;
    try {
        const places = Object.keys(checkedList).filter(key => checkedList[key] !== 0).map(key => +key);
        const orders = await Order.findAll({
            where: {
                customer_id: cusId,
                is_paid: false,
                payment_id: null,
                place_id: places
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
        const total = orders.reduce((acc, item) => acc + item.dataValues.quantity * item.dataValues.item.price, 0)
        res.status(200).json({ total, places });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


function createHash(merchant_id, order_id, amount, currency, status_code) {
    const merchant_secret = process.env.MERCHANT_SECRET;
    const hashed_secret = crypto.MD5(merchant_secret).toString().toUpperCase();
    let hash = crypto.MD5(`${merchant_id}${order_id}${amount}${currency}${status_code}${hashed_secret}`).toString().toUpperCase();
    return hash;
}

function encryptPlaceDetails(placeArray) {
    const merchant_secret = process.env.MERCHANT_SECRET;
    const hashStr = `${placeArray.join('')}${merchant_secret}`;
    return crypto.SHA1(hashStr).toString().toUpperCase();
}
