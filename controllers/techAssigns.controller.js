import User from "../models/user.model.js";
import Place from "../models/place.model.js";
import CustomerPlace from "../models/customerPlace.model.js";
import TechSupport from "../models/techSupport.model.js";
import Room from "../models/room.model.js";
import TechSupportPlace from "../models/techSupportPlace.model.js";
import RelayUnit from "../models/relayUnit.model.js";
import _ from "lodash";
import Device from "../models/device.model.js";
import DeviceSwitching from "../models/deviceSwitching.model.js";

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
        if (!isAssignedToPlace(techSupportID, placeID)) {
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

export const relayUnitsOfPlace = async (req, res) => {
    const { techSupportID, placeID } = req.params;
    try {
        if (!isAssignedToPlace(techSupportID, placeID)) {
            res.status(403).json({ error: "Forbidden" });
        } else {
            const relayUnits = await RelayUnit.findAll({
                where: {
                    place_id: placeID,
                },
            });
            res.status(200).json(relayUnits);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addRelayUnit = async (req, res) => {
    const { techSupportID, placeID } = req.params;
    const { relayUnit } = req.body;
    try {
        if (!isAssignedToPlace(techSupportID, placeID)) {
            res.status(403).json({ error: "Forbidden" });
        } else {
            const newRelayUnit = await RelayUnit.create({
                ...relayUnit,
                place_id: placeID,
                status: "disabled"
            });
            res.status(200).json(newRelayUnit);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const updateRelayUnit = async (req, res) => {
    const { techSupportID, placeID, relayUnitID } = req.params;
    const { relayUnit } = req.body;
    try {
        if (!isAssignedToPlace(techSupportID, placeID)) {
            res.status(403).json({ error: "Forbidden" });
        } else {
            await RelayUnit.update({
                ...relayUnit,
            }, {
                where: {
                    relay_unit_id: relayUnitID,
                },
            });
            res.status(200).json(relayUnit);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteRelayUnit = async (req, res) => {
    const { techSupportID, placeID, relayUnitID } = req.params;
    try {
        if (!isAssignedToPlace(techSupportID, placeID)) {
            res.status(403).json({ error: "Forbidden" });
        } else {
            await RelayUnit.destroy({
                where: {
                    relay_unit_id: relayUnitID,
                },
            });
            res.status(200).json({ relay_unit_id: relayUnitID });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const getDevicesOfRoom = async (req, res) => {
    const { techSupportID, placeID, roomID } = req.params;
    try {
        if (isAssignedToPlace(techSupportID, placeID)) {
            const devices = await Device.findAll({
                where: {
                    room_id: roomID,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt", "room_id"]
                },
            })
            res.status(200).json(devices);
        } else {
            res.status(403).json({ error: "Forbidden" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const addDevice = async (req, res) => {
    const { techSupportID, placeID, roomID } = req.params;
    const { device } = req.body;
    try {
        if (isAssignedToPlace(techSupportID, placeID)) {
            const newDevice = await Device.create({
                ...device,
                is_active: false,
                room_id: roomID,
            });
            await DeviceSwitching.create({
                device_id: newDevice.device_id,
                switch_status: false,
                activity: "none",
                status: "active"
            });
            res.status(200).json(newDevice);
        } else {
            res.status(403).json({ error: "Forbidden" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const updateDevice = async (req, res) => {
    const { techSupportID, placeID, roomID, deviceID } = req.params;
    const { device } = req.body;
    try {
        if (isAssignedToPlace(techSupportID, placeID)) {
            await Device.update({
                ...device,
            }, {
                where: {
                    device_id: deviceID,
                    room_id: roomID,
                },
            });
            res.status(200).json(device);
        } else {
            res.status(403).json({ error: "Forbidden" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const deleteDevice = async (req, res) => {
    const { techSupportID, placeID, roomID, deviceID } = req.params;
    try {
        if (isAssignedToPlace(techSupportID, placeID)) {
            await Device.destroy({
                where: {
                    device_id: deviceID,
                    room_id: roomID,
                },
            });
            res.status(200).json({ device_id: deviceID });
        } else {
            res.status(403).json({ error: "Forbidden" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

async function isAssignedToPlace(techSupportID, placeID) {
    const isAssigned = await TechSupportPlace.findOne({
        where: {
            tech_support_id: techSupportID,
            place_id: placeID,
        },
    });
    if (isAssigned) {
        return true;
    } else {
        return false;
    }
}