import CustomerServiceRequest from "../models/customerServiceRequest.model.js";

export const getCustomerServiceRequests = async (req, res) => {
    try {
        const customerServiceRequests = await CustomerServiceRequest.findAll(
            {
                where: {
                    assign_tech_support_id: req.params.techSupportID,
                },
            }
        );
        res.status(200).json(customerServiceRequests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};