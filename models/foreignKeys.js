
import Customer from "./customer.model.js";
import User from "./user.model.js";

// Define the association
Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Customer, { foreignKey: 'customer_id', as: 'customer' });
