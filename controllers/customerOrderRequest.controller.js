import customerOrderRequest from "../models/customerOrderRequest.model.js";
import customer from "../models/customer.model.js";
import user from "../models/user.model.js";
import db from "../models/index.js";


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
                        },
                    ],
                },
            ],
            attributes: ["tech_support_id", "order_id", "num_of_places", "num_of_rooms", "num_of_devices", "order_description"],
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

