import Customer from "./customer.model.js";
import User from "./user.model.js";
import GuestUser from "./guestUser.model.js";
import TechSupport from "./techSuppoer.model.js";


// Define the association between the Customer and User models
Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Customer, { foreignKey: 'customer_id', as: 'customer' });


// Define the association between the GuestUser and User models
GuestUser.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(GuestUser, { foreignKey: 'guest_user_id', as: 'guestUser' });


// Define the association between the TechSupport and User models
TechSupport.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(TechSupport, { foreignKey: 'tech_support_id', as: 'techSupport' });


// Define the association between the Chat and User models
Chat.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Chat, { foreignKey: 'user_id', as: 'chat' });


// Define the association between the Payment and Order models