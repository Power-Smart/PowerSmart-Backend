import Room from "../models/room.model.js";


export const getRooms = async (req, res) => {
    const customerID = req.params.customerID;
    const placeID = req.params.placeID;

    console.log(customerID);
    console.log(placeID);

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