import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export const getCustomerDetails = async (req, res) => {
    let customerID = req.params.customerID;
    try {
        const customer = await Customer.findByPk(customerID, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["user_id","first_name", "last_name"],
                },
            ],
        });

        res.send(customer);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
};
