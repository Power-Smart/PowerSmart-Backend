// backend/controllers/techSupportAdd.controller.js
import TechSupport from "../models/techSupport.model.js";

// Add new tech support
export const addTechSupport = async (req, res) => {
    try {
        const { user_id, profile_pic } = req.body;
        const techSupport = await TechSupport.create({
            user_id,
            profile_pic,
        });
        res.status(201).json(techSupport);
    } catch (error) {
        console.error("Error adding tech support:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
