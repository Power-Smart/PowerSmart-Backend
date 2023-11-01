import customerOrderRequest from "../models/customerOrderRequest.model.js";
import customer from "../models/customer.model.js";
import user from "../models/user.model.js";
import db from "../models/index.js";
import TechSupport from "../models/techSupport.model.js";


export const getCustomerOrderRequests = async (req, res) => {
    try {
        // const [results, metadata] = await db.query(`SELECT ${customerOrderRequest.num_of_devices} FROM ${customerOrderRequest}, ${user} WHERE ${customerOrderRequest.customerId} = ${user.user_id}`);
        const results = await customerOrderRequest.findAll({
            include: [
                {
                    model: customer,
                    as: "customer",
                    attributes: ["user_id", "profile_pic"],
                    include: [
                        {
                            model: user,
                            as: "user",
                            attributes: ["user_id", "first_name", "last_name"]
                        }
                    ],
                },
            ],
            attributes: ["user_id", "assign_tech_support_id", "order_id", "place_id", "num_of_rooms", "num_of_devices", "order_description", "is_order_completed", "is_tech_support_assigned"],
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const deleteCustomerOrderRequest = async (req, res) => {
    console.log("deleteCustomerOrderRequest");
    // try {
    //     const { orderID } = req.params;
    //     const results = await customerOrderRequest.destroy({
    //         where: {
    //             order_id: orderID,
    //         },
    //     });
    //     res.status(200).json(results);
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }
}

export const addCustomerOrderRequest = async (req, res) => {
    try {
        const { customer_id, place_id, order_description, number_of_rooms, number_of_devices } = req.body;
        // console.log(req.body)
        const results = await customerOrderRequest.create({
            user_id: customer_id,
            place_id: place_id,
            order_description: order_description,
            num_of_rooms: number_of_rooms,
            num_of_devices: number_of_devices,
            is_tech_support_assigned: false,
            is_order_completed: false,
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const acceptCustomerOrderRequest = async (req, res) => {
    try {
        const { orderID, tech_support_id, customerID } = req.params;
        const results = await customerOrderRequest.update({
            is_tech_support_assigned: true,
            assign_tech_support_id: tech_support_id,
        }, {
            where: {
                order_id: orderID,
            },
        });
        const result = await TechSupport.update({
            customers: db.Sequelize.fn('array_append', db.Sequelize.col('customers'), customerID),
        }, {
            where: {
                user_id: tech_support_id,
            },
        });
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}