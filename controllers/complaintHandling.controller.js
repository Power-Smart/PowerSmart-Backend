import complaintHandling from "../models/complaintHandling.model.js";
import user from "../models/user.model.js";
import customer from "../models/customer.model.js";


export const getComplaintHandling = async (req, res) => {
    try {
        const { techSupportID } = req.params;
        const complaintHandlingResult = await complaintHandling.findAll({
            include: [
                {
                    model: customer,
                    as: "customer",
                    attributes: ["user_id", "profile_pic"],
                    include: [
                        {
                            model: user,
                            as: "user",
                            attributes: ["user_id", "first_name", "last_name"]
                        },
                    ],
                },
            ],
            attributes: ["complaint_id", "customer_id", "assign_tech_support_id", "description", "date", "is_solve", "comment"],

        });
        res.status(200).json(complaintHandlingResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
