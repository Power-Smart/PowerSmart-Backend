import User from "../models/user.model.js";
import Place from "../models/place.model.js";
import CustomerPlace from "../models/customerPlace.model.js";
import TechSupport from "../models/techSupport.model.js";
import Room from "../models/room.model.js";
import TechSupportPlace from "../models/techSupportPlace.model.js";
import _ from "lodash";

export const assignedCustomers = async (req, res) => {
    const { techSupportID } = req.params;
    try {
        const assignedCustomers = await TechSupport.findOne({
            where: {
                user_id: techSupportID,
            },
            attributes: ["customers"],
        });
        const assignedCustomerDetails = await User.findAll({
            where: {
                user_id: assignedCustomers.customers,
                role: 1
            },
            attributes: ["user_id", "first_name", "last_name", "email"],
        });
        res.status(200).json(assignedCustomerDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const assignedPlacesByCustomer = async (req, res) => {
    const { techSupportID, customerID } = req.params;
    try {
        const assigned = await TechSupportPlace.findAll({
            where: {
                tech_support_id: techSupportID,
            },
        });
        const assignedPlaces = await CustomerPlace.findAll({
            where: {
                place_id: assigned.map((assignedPlace) => assignedPlace.place_id),
                user_id: customerID,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "access_level"]
            },
            include: {
                model: Place,
                as: "place",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "place_id"]
                }
            },
        });
        assignedPlaces.forEach((assignedPlace) => {
            assigned.forEach((assignedPlaceID) => {
                if (assignedPlace.place_id === assignedPlaceID.place_id) {
                    assignedPlace.dataValues.access_type = assignedPlaceID.access_type;
                }
            });
        });
        res.status(200).json(assignedPlaces);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const assignedRoomsByPlace = async (req, res) => {
    const { techSupportID, placeID } = req.params;
    try {
        const isAssigned = await TechSupportPlace.findOne({
            where: {
                tech_support_id: techSupportID,
                place_id: placeID,
            },
        });
        if (!isAssigned) {
            res.status(403).json({ error: "Forbidden" });
        } else {
            const rooms = await Room.findAll({
                where: {
                    place_id: placeID,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
            });
            res.status(200).json(rooms);
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}