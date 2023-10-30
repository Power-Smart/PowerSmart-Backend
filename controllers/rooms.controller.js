import Room from "../models/room.model.js";
import Device from "../models/device.model.js";
import sequelize from "../models/index.js";
import DeviceSwitching from "../models/deviceSwitching.model.js";

export const getRooms = async (req, res) => {
    const { customerID, placeID } = req.params;

    try {
        const customerRooms = await Room.findAll({
            where: {
                place_id: placeID,
                user_id: customerID,
            },
            attributes: [
                "room_id",
                "place_id",
                "name",
                "window_type",
                "is_active",
                "size",
                "type",
            ],
        });

        const devices = await Device.findAll({
            where: {
                room_id: customerRooms.map((room) => room.room_id),
            },
            attributes: [
                "room_id",
                [
                    sequelize.fn("COUNT", sequelize.col("room_id")),
                    "device_count",
                ],
            ],
            group: ["room_id"],
        });

        customerRooms.forEach((room) => {
            const count = devices.filter(
                (device) =>
                    device.dataValues.room_id === room.dataValues.room_id
            );

            if (count.length === 0) {
                room.dataValues.device_count = 0;
            } else {
                room.dataValues.device_count = count[0].dataValues.device_count;
            }
        });

        res.send(customerRooms);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Finding the Rooms");
    }
};

export const addRoom = async (req, res) => {
    const { name, size, id, placeID, window_type, active_status, room_type } =
        req.body;
    console.log(req.body);
    try {
        const room = await Room.create({
            window_type,
            is_active: active_status,
            size: size,
            type: room_type,
            place_id: placeID,
            user_id: id,
            name: name,
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
    const { name, window_type, size, room_type, active_status } = req.body;

    // console.log(req.body)

    try {
        const room = await Room.findByPk(roomID);

        if (!room) {
            return res.status(404).send("Room not found");
        }

        room.name = name;
        room.window_type = window_type;
        room.size = size;
        room.type = room_type;
        room.is_active = active_status;
        await room.save();

        // console.log(room.dataValues);
        res.status(201).send(room.dataValues);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating rooms");
    }
};
