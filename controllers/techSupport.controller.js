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
    const { first_name, last_name, tel_no } = req.body;

    try {
        const techSupport = await TechSupport.findByPk(id);
        if (!techSupport) {
            return res.status(404).send("TechSupport not found");
        }
        techSupport.tel_no = tel_no;
        await techSupport.save();

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.first_name = first_name;
        user.last_name = last_name;
        await user.save();

        res.status(200).send(techSupport);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating profile");
    }
};