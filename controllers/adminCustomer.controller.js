import Customer from "../models/customer.model.js";
import User from "../models/user.model.js";

export const getCustomerView = async (req, res) => {
    try {
        const results = await Customer.findAll({
            include: {
                model: User,
                as: 'user',  // Assuming you have defined 'as' property in your association in Sequelize
                attributes: ['user_id', 'first_name', 'last_name', 'email'],
            },
            order: [[{ model: User, as: 'user' }, 'user_id', 'ASC']],
        });

        // Extract the user data from the nested JSON and send it back
        const customersWithUserData = results.map(customer => {
            return {
                user_id: customer.user.user_id,
                first_name: customer.user.first_name,
                last_name: customer.user.last_name,
                email: customer.user.email,
                year_subscription: customer.year_subscription,
                points: customer.points,
                is_banned: customer.is_banned
            };
        });

        res.status(200).json(customersWithUserData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}