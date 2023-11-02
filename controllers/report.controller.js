import Report from "../models/report.model.js";
import Feedback from "../models/feedback.model.js";


export const addReport = async (req, res) => {
    try {
        const { phone_number, email, description, id } = req.body;

        console.log(req.body);

        if (!phone_number || !email || !description || !id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const report = await Report.create({
            user_id: id,
            phone_number: phone_number,
            email: email,
            description: description,
        });

        console.log("Report Created Successfully");
        res.status(201).json(report);
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: 'Error creating report' });
    }
};


export const addFeedback = async (req, res) => {
    // console.log(req.body)
    const { rate, description, id } = req.body;

    try {
        const report = await Feedback.create({
            rate: rate,
            description: description,
            user_id: id,
        });
        res.status(201).send(report);
        console.log("Feedback Created Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating feedback");
    }
};