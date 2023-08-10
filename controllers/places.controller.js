import Place from "../models/place.model.js";
import CustomerPlace from "../models/customerPlace.model.js";
import Room from "../models/room.model.js";
import sequelize from "../models/index.js";

export const getPlaces = async (req, res) => {
    const userID = req.params.id;
    try {
        const customerPlaces = await CustomerPlace.findAll({
            where: {
                user_id: userID,
                access_level: 1,
            },
            attributes: ["place_id"],
        });
        const places = await Place.findAll({
            where: {
                place_id: customerPlaces.map((place) => place.place_id),
            },
        });
        const rooms = await Room.findAll({
            where: {
                place_id: places.map((place) => place.place_id),
            },
            attributes: [
                "place_id",
                [sequelize.fn("COUNT", sequelize.col("room_id")), "room_count"],
            ],
            group: ["place_id"],
        });
        places.forEach((place) => {
            const count = rooms.filter(
                (room) => room.place_id === place.place_id
            );
            if (count.length === 0) {
                place.dataValues.room_count = 0;
            } else {
                place.dataValues.room_count = count[0].dataValues.room_count;
            }
        });
        res.send(places);
    } catch (err) {
        console.log(err);
        res.status(500).send("error finding places");
    }
};

export const getPlace = async (req, res) => {
    const placeID = req.params.placeID;
    try {
        const place = await Place.findOne({
            where: {
                place_id: placeID,
            },
        });
        const rooms = await Room.findAll({
            where: {
                place_id: placeID,
            },
        });
        res.send({ place, rooms });
    } catch (err) {
        console.log(err);
        res.status(500).send("error finding place");
    }
};

export const addPlace = async (req, res) => {
    const { id, name, location, postal_code } = req.body;
    try {
        const place = new Place({
            name,
            postal_code,
            location,
            is_active: false,
        });
        await place.save();

        const customerPlace = new CustomerPlace({
            user_id: id,
            place_id: place.place_id,
            access_level: 1,
        });
        await customerPlace.save();

        res.status(201).send(place);
    } catch (err) {
        console.log(err);
        res.status(500).send("error creating place");
    }
};

export const updatePlace = async (req, res) => {
    const { placeID } = req.params;
    const { name, location } = req.body;

    try {
        await Place.update(
            {
                name,
                location,
            },
            {
                where: {
                    place_id: placeID,
                },
            }
        );
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send("error updating place");
    }
};
