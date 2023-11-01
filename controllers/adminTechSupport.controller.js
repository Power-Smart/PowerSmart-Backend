import TechSupport from "../models/techSupport.model.js";
import User from "../models/user.model.js";

export const getTechSupportView = async (req, res) => {
    try {
        const results = await TechSupport.findAll({
            include: {
                model: User,
                as: 'user',  // Assuming you have defined 'as' property in your association in Sequelize
                attributes: ['user_id', 'first_name', 'last_name', 'email'],
            },
            order: [[{ model: User, as: 'user' }, 'user_id', 'ASC']],
        });

        // Extract the user data from the nested JSON and send it back
        const techSupportWithUserData = results.map(techSupport => {
            return {
                user_id: techSupport.user.user_id,
                first_name: techSupport.user.first_name,
                last_name: techSupport.user.last_name,
                email: techSupport.user.email,
                tel_no: techSupport.tel_no,
                is_banned: techSupport.is_banned
            };
        });

        res.status(200).json(techSupportWithUserData);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}