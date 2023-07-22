import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";

export const getRoot = async (req, res) => {
    res.send(
        "<h1 style='text-align:center;'> This is the backend server for the Web App. </h1>"
    );
};

export const testInsert = async (req, res) => {
    try {
        const user = await User.create(
            {
                id: 2,
                name: "alice123",
                email: "hello",
                password: "1234",
            },
            { fields: ["id", "name", "email", "password"] }
        );
        await user.save();
        res.send(user);
    } catch (err) {
        console.log(err);
        res.send("eror insertion");
    }
};
