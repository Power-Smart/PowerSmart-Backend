import ComplaintHandling from "../models/complaintHandling.model.js";

export const getComplaintsView = async (req, res) => {
    try {
        const complaints = await ComplaintHandling.findAll({
            order: [['complaint_id', 'ASC']],
        });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getComplaintInfo = async (req, res) => {
    const { complaintId } = req.params;
    try {
        const complaint = await ComplaintHandling.findOne({
            where: {
                complaint_id: complaintId,
            },
        });
        
        if (!complaint) {
            res.status(404).json({ message: `Complaint with ID ${complaintId} not found.` });
        } else {
            res.status(200).json(complaint);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateComplaint = async (req, res) => {
    const { complaintId } = req.params;
    const { assign_tech_support_id, is_solve } = req.body;

    try {
        const complaint = await ComplaintHandling.findOne({
            where: {
                complaint_id: complaintId,
            },
        });

        if (!complaint) {
            return res.status(404).json({ message: `Complaint with ID ${complaintId} not found.` });
        }

        // Update the complaint properties with the new values
        complaint.assign_tech_support_id = assign_tech_support_id;
        complaint.is_solve = is_solve;

        // Save the updated complaint
        await complaint.save();

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

