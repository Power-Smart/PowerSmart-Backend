import TechSupport from "../models/techSupport.model.js";
import User from "../models/user.model.js";


export const getTechSupportUser = async (req, res) => {
    let id = req.params.techSupportID;
    try {
        const techSupport = await TechSupport.findByPk(id);
        res.send(techSupport);
    } catch (e) {
        res.status(500).send(e);
    }
};


export const updateTechSupportProfile = async (req, res) => {
    const id = req.params.techSupportID;
    const { first_name, last_name } = req.body;

    try {
        const customer = await TechSupport.findByPk(id);
        // customer.tel_no = tel_no;
        await customer.save();
        const user = await User.findByPk(id);
        user.first_name = first_name;
        user.last_name = last_name;
        await user.save();
        res.status(200).send("customer");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating profile");
    }
};