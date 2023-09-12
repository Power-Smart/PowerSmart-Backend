import TechSupport from "../models/techSupport.model.js";
import User from "../models/user.model.js";


export const getAssignedTechSupportForCustomer = async (req, res) => {
    try {
        const customerID = parseInt(req.params.customerID);
        const assignedTechSupport = await TechSupport.findAll({
            attributes: ['user_id', 'profile_pic', 'tel_no', 'is_banned', 'customers'],
        });

        const filteredTechSupport = assignedTechSupport.filter((techSupport) => {
            const allCustomers = techSupport.customers;
            return allCustomers.includes(customerID);
        });

        const techSupportWithUserDetails = await Promise.all(filteredTechSupport.map(async (techSupport) => {
            const techID = techSupport.user_id;

            const techUserDetails = await User.findOne({
                where: {
                    user_id: techID,
                }
            })
            techSupport.dataValues.userDetails = techUserDetails;
            return techSupport;
        }));


        res.status(200).json(techSupportWithUserDetails);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
