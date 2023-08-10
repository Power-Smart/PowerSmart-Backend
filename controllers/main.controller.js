import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export const getRoot = async (req, res) => {
    res.send(
        "<h1 style='text-align:center;'> This is the backend server for the Web App. </h1>"
    );
};

export const testInsert = async (req, res) => {
    try {
        const cust = await Customer.create({
            customer_id: 5,
            points: 30,
            tel_no: "0787467743",
            address: "No 15",
            is_banned: false,
            profile_pic: "",
        });
        await cust.save();
        res.send(cust);
    } catch (err) {
        console.log(err);
        res.send("error insertion");
    }
};
