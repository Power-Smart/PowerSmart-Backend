import Customer from "./customer.model.js";
import User from "./user.model.js";
import GuestUser from "./guestUser.model.js";
import TechSupport from "./techSupport.model.js";   
import Chat from "./chat.model.js";
import Message from "./message.model.js";
import Admin from "./admin.model.js";
import Schedule from "./schedule.model.js";
import Feedback from "./feedback.model.js";
import Device from "./device.model.js";
import DeviceSchedule from "./deviceSchedule.model.js";
// import Achievement from "./achievement.model.js";
import CustomerPlace from "./customerPlace.model.js";
import Place from "./place.model.js";
import Room from "./room.model.js";
import RelayUnit from "./relayUnit.model.js";
import SensorUnit from "./sensorUnit.model.js";
import Sensor from "./sensor.model.js";
import Relay from "./relay.model.js";
import Supplier from "./supplier.model.js";
import Supply from "./supply.model.js";
import Item from "./item.model.js";
import StockManager from "./stockManager.model.js";
import Order from "./order.model.js";
import Payment from "./payment.model.js";
import InformUsage from "./informUsage.model.js";



// Define the association between the InformUsage and Customer models
InformUsage.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasOne(InformUsage, { foreignKey: 'customer_id', as: 'informUsage' });


// Define the association between the InformUsage and GuestUser models
InformUsage.belongsTo(GuestUser, { foreignKey: 'guest_id', as: 'guestUser' });
GuestUser.hasOne(InformUsage, { foreignKey: 'guest_id', as: 'informUsage' });



// Define the association between the Payment and Customer models
Payment.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasOne(Payment, { foreignKey: 'customer_id', as: 'payment' });


// Define the association between the Order and Item models
Order.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
Item.hasOne(Order, { foreignKey: 'item_id', as: 'order' });


// Define the association between the Order and Payment models
Order.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });
Payment.hasOne(Order, { foreignKey: 'payment_id', as: 'order' });



// Define the association between the Item and StockManager models
Item.belongsTo(StockManager, { foreignKey: 'stock_manager_id', as: 'stockManager' });
StockManager.hasOne(Item, { foreignKey: 'stock_manager_id', as: 'item' });


// Define the association between the StockManager and Supply models
Supply.belongsTo(StockManager, { foreignKey: 'stock_manager_id', as: 'stockManager' });
StockManager.hasOne(Supply, { foreignKey: 'stock_manager_id', as: 'supply' });



// Define the association between the StockManager and User models
StockManager.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(StockManager, { foreignKey: 'stock_manager_id', as: 'stockManager' });


// Define the association between the Supply and Supplier models
Supply.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
Supplier.hasOne(Supply, { foreignKey: 'supplier_id', as: 'supply' });


// Define the association between the Relay and RelayUnit models
RelayUnit.belongsTo(Relay, { foreignKey: 'relay_id', as: 'relay' });
Relay.hasOne(RelayUnit, { foreignKey: 'relay_id', as: 'relayUnit' });


// Define the association between the Sensor and SensorUnit models
SensorUnit.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });
Sensor.hasOne(SensorUnit, { foreignKey: 'sensor_id', as: 'sensorUnit' });


// Define the association between the SensorUnit and Room models
// Room.belongsTo(SensorUnit, { foreignKey: 'sensor_unit_id', as: 'sensorUnit' });
// SensorUnit.hasOne(Room, { foreignKey: 'sensor_unit_id', as: 'room' });


// Define the association between the RelayUnit and Place models
RelayUnit.belongsTo(Place, { foreignKey: 'place_id', as: 'place' });
Place.hasOne(RelayUnit, { foreignKey: 'place_id', as: 'relayUnit' });




// Define the association between the Place and Room models
Room.belongsTo(Place, { foreignKey: 'place_id', as: 'place' });
Place.hasOne(Room, { foreignKey: 'place_id', as: 'room' });

Room.belongsTo(Customer,{foreignKey:'customer_id', as:'customer'});
Customer.hasMany(Room,{foreignKey:'customer_id', as:'room'});


// Define the association between the Customer_Place and Place models
CustomerPlace.belongsTo(Place, { foreignKey: 'place_id', as: 'place' });
Place.hasOne(CustomerPlace, { foreignKey: 'place_id', as: 'customerPlace' });



// Define the association between the Customer and CustomerPlace models 
CustomerPlace.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasOne(CustomerPlace, { foreignKey: 'customer_id', as: 'customerPlace' });


// Define the association between the Customer and Achievement models
// Achievement.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });



// Define the association between the Schedule and DeviceSchedule models
DeviceSchedule.belongsTo(Schedule, { foreignKey: 'schedule_id', as: 'schedule' });
Schedule.hasOne(DeviceSchedule, { foreignKey: 'schedule_id', as: 'deviceSchedule' });


// Define the association between the Device and DeviceSchedule models
DeviceSchedule.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });
Device.hasOne(DeviceSchedule, { foreignKey: 'schedule_id', as: 'deviceSchedule' });


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

