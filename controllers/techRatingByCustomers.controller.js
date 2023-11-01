import TechSupportRating from "../models/techSupportRating.model.js";


export const getTechSupportRating = async (req, res) => {
    try {
        const techSupportRating = await TechSupportRating.findAll({
            where: {
                tech_support_id: req.params.techSupportID
            }
        });
        res.status(200).json(techSupportRating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
