import complaintHandling from "../models/complaintHandling.model.js";
import user from "../models/user.model.js";
import customer from "../models/customer.model.js";


export const getComplaintHandling = async (req, res) => {
    try {
        // const complaintHandlingResult = await complaintHandling.findAll({
        //     include: [
        //         { model: user },
        //         { model: customer },
        //     ],
        //     attributes: [ "complaint_id", "description", "date", "is_solve", "comment"],
        // });

        const { techSupportID } = req.params;

        const complaintHandlingResult = await complaintHandling.findAll({
            where: {
                assign_tech_support_id: techSupportID,
            },
        });
        res.status(200).json(complaintHandlingResult);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const acceptOrRejectComplaint = async (req, res) => {
    const { complaint_id, is_solve, comment } = req.body;
    try {
        const complaintHandlingResult = await complaintHandling.update(
            {
                is_solve: is_solve,
                comment: comment,
            },
            {
                where: {
                    complaint_id: complaint_id,
                },
            }
        );
        res.status(200).json(complaintHandlingResult);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};