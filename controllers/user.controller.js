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

export const updateCustomerProfile = async (req, res) => {
    const id = req.params.id;
    const { name, tel_no, address } = req.body;
    try {
        const customer = await Customer.findByPk(id);
        customer.tel_no = [tel_no.split(",")];
        customer.address = address;
        await customer.save();
        const user = await User.findByPk(id);
        user.name = name;
        await user.save();
        res.status(200).send(customer);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating profile");
    }
};

export const saveProfile = async (req, res) => {
    // console.log(req.params.id);
    // console.log(req.file);
    res.status(200).send();
};
