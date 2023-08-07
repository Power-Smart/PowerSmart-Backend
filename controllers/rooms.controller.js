import Room from "../models/room.model.js";


export const getRooms = async (req, res) => {
    const customerID = req.params.customerID;
    const placeID = req.params.placeID;

    console.log("Customer ID: " + customerID);
    console.log("Place ID: " + placeID);

    try {
        const customerRooms = await Room.findAll({
            where: {
                place_id: placeID,
                customer_id: customerID
            },
            attributes: ["place_id", "name", "window_type", "is_active", "size", "type", "place_id", "customer_id"]
        });
        res.send(customerRooms);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Finding the Rooms");
    }
};


export const addRoom = async (req, res) => {
    const { window_type, is_active, size, type, placeID, id,name} = req.body;

    console.log(req.body);

    try {
        const room = await Room.create({
            window_type: window_type,
            is_active: true,
            size: size,
            type: type,
            place_id: placeID,
            customer_id: id,
            name: name
        });
        res.status(201).send(room);
        console.log("Room Created Successfully");
    }catch(error){
        console.log(error);
        res.status(500).send("Error creating room");
    }
};



