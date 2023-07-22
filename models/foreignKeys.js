import Customer from "./customer.model.js";
import User from "./user.model.js";
import GuestUser from "./guestUser.model.js";
import TechSupport from "./techSupport.model.js";   
import Chat from "./chat.model.js";
import Message from "./message.model.js";
import Admin from "./admin.model.js";
import Schedule from "./schedule.model.js";
import Feedback from "./feedback.model.js";


// Define the association between the Customer and Feedback models
Feedback.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasOne(Feedback, { foreignKey: 'feedback_id', as: 'feedback' });


// Define the association between the Schedule and Customer models
Schedule.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasOne(Schedule, { foreignKey: 'schedule_id', as: 'schedule' });


// Define the association between the User and Admin models
Admin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Admin, { foreignKey: 'admin_id', as: 'admin' });


// Define the association between the Chat and Message models
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });
Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages' });


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

