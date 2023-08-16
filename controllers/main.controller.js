import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";
import axios from "axios";

export const getRoot = async (req, res) => {
    res.send(
        "<h1 style='text-align:center;'> This is the backend server for the Web App. </h1>"
    );
};

export const testInsert = async (req, res) => {
    try {
        axios.get("https://randomuser.me/api/").then((response) => {
            res.send(response.data);
        });
    } catch (err) {
        console.log(err);
        res.send("error insertion");
    }
};
