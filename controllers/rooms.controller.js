import Room from "../models/room.model.js";


export const getRooms = async (req, res) => {
    const {customerID, placeID} = req.params;

    try {
        const customerRooms = await Room.findAll({
            where: {
                place_id: placeID,
                user_id: customerID
            },
            attributes: ["room_id", "place_id", "name", "window_type", "is_active", "size", "type"]
        });
        res.send(customerRooms);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Finding the Rooms");
    }
};


export const addRoom = async (req, res) => {
    const { window_type, is_active, size, type, placeID, id, name } = req.body;

    console.log(req.body)

    try {
        const room = await Room.create({
            window_type: window_type,
            is_active: true,
            size: size,
            type: type,
            place_id: placeID,
            user_id: id,
            name: name
        });
        res.status(201).send(room);
        console.log("Room Created Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating room");
    }
};


export const updateRoom = async (req, res) => {
    const { placeID, roomID } = req.params;
    const { name, window_type, size, type } = req.body;

    console.log(req.body)

    try {
        await Room.update(
            {
                name,
                window_type,
                size,
                type
            },
            {
                where: {
                    place_id: placeID,
                    room_id: roomID
                },
            }
        );
        res.status(200).send("update Successfully");
    } catch (error) {
        console.log(error);  
        res.status(500).send("Error updating rooms");
    }
};



