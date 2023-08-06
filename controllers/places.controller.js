import Place from "../models/place.model.js";
import CustomerPlace from "../models/customerPlace.model.js";
import Room from "../models/room.model.js";

export const getPlaces = async (req, res) => {
    const userID = req.params.id;
    try {
        const customerPlaces = await CustomerPlace.findAll({
            where: {
                customer_id: userID,
                is_owner: true,
            },
            attributes: ["place_id"],
        });
        const places = await Place.findAll({
            where: {
                place_id: customerPlaces.map((place) => place.place_id),
            },
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
            customer_id: id,
            place_id: place.place_id,
            is_owner: true,
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
