import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export const getUser = async (req, res) => {
    let id = req.params.id;
    try {
        const customer = await Customer.findByPk(id);
        res.send(customer);
    } catch (e) {
        res.status(500).send(e);
    }
};
