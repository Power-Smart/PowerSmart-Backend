import Customer from "./customer.model.js";
import User from "./user.model.js";
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
import Supplier from "./supplier.model.js";
import Supply from "./supply.model.js";
import Item from "./item.model.js";
import StockManager from "./stockManager.model.js";
import Order from "./order.model.js";
import Payment from "./payment.model.js";
import InformUsage from "./informUsage.model.js";
import SensorData from "./sensorData.model.js";
import ModelPrediction from "./modelPrediction.model.js";
import DeviceSwitching from "./deviceSwitching.model.js";
import TechSupportPlace from "./techSupportPlace.model.js"
import OwnedItem from "./ownedItem.model.js";

// import Marketplace from "./marketplace.model.js";
import CustomerOrderRequest from "./customerOrderRequest.model.js";
import TechSupportRating from "./techSupportRating.model.js";
import ComplaintHandling from "./complaintHandling.model.js";
import CustomerServiceRequest from "./customerServiceRequest.model.js";

import GuestUserSuggest from "./guestUserSuggest.model.js";
import GuestUser from "./guestUser.model.js";

// Define the association between the Customer and GuestUser models
Customer.belongsTo(GuestUser, { foreignKey: "user_id", as: "guestUser" });
GuestUser.hasOne(Customer, { foreignKey: "user_id", as: "customer" });


ComplaintHandling.belongsTo(Customer, { foreignKey: "user_id",  });
Customer.hasMany(ComplaintHandling, { foreignKey: "customer_id",  });

ComplaintHandling.belongsTo(TechSupport, { foreignKey: "user_id", as: "techSupport" });
TechSupport.hasMany(ComplaintHandling, { foreignKey: "tech_support_id", as: "complaintHandling" });


// Define the association between the Customer and CustomerOrderRequest models
CustomerOrderRequest.belongsTo(Customer, { foreignKey: "user_id", as: "customer" });
Customer.hasMany(CustomerOrderRequest, { foreignKey: "user_id", as: "customerOrderRequest" });


// Define the association between the Chat and User models
User.belongsTo(Chat, { foreignKey: "sender_id", as: "sender_chat" });
User.belongsTo(Chat, { foreignKey: "receiver_id", as: "receiver_chat" });







// Define the association between the InformUsage and Customer models
InformUsage.belongsTo(Room, { foreignKey: "room_id", as: "room" });
Room.hasMany(InformUsage, { foreignKey: "room_id", as: "informUsage" });

// Define the association between the InformUsage and GuestUser models
InformUsage.belongsTo(GuestUser, { foreignKey: "guest_id", as: "guestUser" });
GuestUser.hasOne(InformUsage, { foreignKey: "guest_id", as: "informUsage" });

// Define the association between the Payment and Customer models
Payment.belongsTo(Customer, { foreignKey: "user_id", as: "customer" });
Customer.hasOne(Payment, { foreignKey: "user_id", as: "payment" });

// Define the association between the Order and Item models
Order.belongsTo(Item, { foreignKey: "item_id", as: "item" });
Item.hasOne(Order, { foreignKey: "item_id", as: "order" });

// Define the association between the Order and Payment models
Order.belongsTo(Payment, { foreignKey: "payment_id", as: "payment" });
Payment.hasOne(Order, { foreignKey: "payment_id", as: "order" });

// Define the association between the Item and StockManager models
Item.belongsTo(StockManager, {
    foreignKey: "user_id",
    as: "stockManager",
});
StockManager.hasOne(Item, { foreignKey: "user_id", as: "item" });

// Define the association between the StockManager and Supply models
Supply.belongsTo(StockManager, {
    foreignKey: "user_id",
    as: "stockManager",
});
StockManager.hasOne(Supply, { foreignKey: "user_id", as: "supply" });

// Define the association between the StockManager and User models
StockManager.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(StockManager, {
    foreignKey: "user_id",
    as: "stockManager",
});

// Define the association between the Supply and Supplier models
Supply.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });
Supplier.hasOne(Supply, { foreignKey: "supplier_id", as: "supply" });

// Define the association between the SensorUnit and Room models
Room.belongsTo(SensorUnit, { foreignKey: "sensor_unit_id", as: "sensorUnit" });
SensorUnit.hasOne(Room, { foreignKey: "sensor_unit_id", as: "room" });

// Define the association between the RelayUnit and Place models
RelayUnit.belongsTo(Place, { foreignKey: "place_id", as: "place" });
Place.hasOne(RelayUnit, { foreignKey: "place_id", as: "relayUnit" });

// Define the association between the Place and Room models
Room.belongsTo(Place, { foreignKey: "place_id", as: "place" });
Place.hasOne(Room, { foreignKey: "place_id", as: "room" });

Room.belongsTo(Customer, { foreignKey: "user_id", as: "customer" });
Customer.hasMany(Room, { foreignKey: "user_id", as: "room" });

// Define the association between the Customer_Place and Place models
CustomerPlace.belongsTo(Place, { foreignKey: "place_id", as: "place" });
Place.hasOne(CustomerPlace, { foreignKey: "place_id", as: "customerPlace" });

// Define the association between the Customer and CustomerPlace models
CustomerPlace.belongsTo(Customer, {
    foreignKey: "user_id",
    as: "customer",
});
Customer.hasOne(CustomerPlace, {
    foreignKey: "user_id",
    as: "customerPlace",
});

// Define the association between the Customer and Achievement models
// Achievement.belongsTo(Customer, { foreignKey: 'user_id', as: 'customer' });

// Define the association between the Schedule and DeviceSchedule models
DeviceSchedule.belongsTo(Schedule, {
    foreignKey: "schedule_id",
    as: "schedule",
});
Schedule.hasOne(DeviceSchedule, {
    foreignKey: "schedule_id",
    as: "deviceSchedule",
});

// Define the association between the Device and DeviceSchedule models
DeviceSchedule.belongsTo(Device, { foreignKey: "device_id", as: "device" });
Device.hasOne(DeviceSchedule, {
    foreignKey: "schedule_id",
    as: "deviceSchedule",
});

// Define the association between the Customer and Feedback models
Feedback.belongsTo(Customer, { foreignKey: "user_id", as: "customer" });
Customer.hasOne(Feedback, { foreignKey: "feedback_id", as: "feedback" });

// Define the association between the Schedule and Customer models
Schedule.belongsTo(Customer, { foreignKey: "user_id", as: "customer" });
Customer.hasOne(Schedule, { foreignKey: "schedule_id", as: "schedule" });

// Define the association between the User and Admin models
Admin.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(Admin, { foreignKey: "user_id", as: "admin" });

// Define the association between the Chat and Message models
// Message.belongsTo(Chat, { foreignKey: "chat_id", as: "chat" });
// Chat.hasMany(Message, { foreignKey: "chat_id", as: "messages" });

// Define the association between the Customer and User models
Customer.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(Customer, { foreignKey: "user_id", as: "customer" });



// Define the association between the TechSupport and User models
TechSupport.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(TechSupport, { foreignKey: "user_id", as: "techSupport" });



Device.belongsTo(Room, { foreignKey: "room_id", as: "room" });
Room.hasMany(Device, { foreignKey: "room_id", as: "devices" });

Device.belongsTo(RelayUnit, { foreignKey: "relay_unit_id", as: "relayUnit" });
RelayUnit.hasMany(Device, { foreignKey: "relay_unit_id", as: "devices" });

Schedule.belongsTo(Place, { foreignKey: "place_id", as: "place" });
Place.hasMany(Schedule, { foreignKey: "place_id", as: "schedules" });

SensorData.belongsTo(SensorUnit, {
    foreignKey: "sensor_unit_id",
    as: "sensorUnit",
});
SensorUnit.hasMany(SensorData, {
    foreignKey: "sensor_unit_id",
    as: "sensorData",
});

ModelPrediction.belongsTo(Room, { foreignKey: "room_id", as: "room" });
Room.hasMany(ModelPrediction, { foreignKey: "room_id", as: "modelPrediction" });

DeviceSwitching.belongsTo(Device, { foreignKey: "device_id", as: "device" });
Device.hasMany(DeviceSwitching, {
    foreignKey: "device_id",
    as: "deviceSwitching",
});

DeviceSwitching.belongsTo(Schedule, {
    foreignKey: "which_schedule",
    as: "schedue",
});
Schedule.hasMany(DeviceSwitching, {
    foreignKey: "which_schedule",
    as: "deviceSwitching",
});

Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Order, { foreignKey: "customer_id", as: "order" });

Order.belongsTo(TechSupport, {
    foreignKey: "tech_support_id",
    as: "techSupport",
});
TechSupport.hasMany(Order, { foreignKey: "tech_support_id", as: "order" });


// // Define the association between the GuestUser and User models
// GuestUser.belongsTo(User, { foreignKey: "user_id", as: "user" });
// User.hasOne(GuestUser, { foreignKey: "guest_id", as: "guestUser" });