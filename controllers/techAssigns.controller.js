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
import SensorUnit from "../models/sensorUnit.model.js";
import SensorData from "../models/sensorData.model.js";
import OwnedItem from "../models/ownedItem.model.js";
import sequelize from "../models/index.js";
import { notify } from "../utils/helperFunctions.js";

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

export const requestCustomer = async (req, res) => {
    const { tech_support_id, place_id } = req.params;
    try {
        await TechSupportPlace.update({
            access_type: 2,
        }, {
            where: {
                tech_support_id: tech_support_id,
                place_id: place_id,
            },
        });
        res.status(200).json({ message: "Request Sent" });
        const customer = await CustomerPlace.findOne({
            where: {
                place_id: place_id,
            },
        });
        if (customer) {
            await notify(tech_support_id, customer.dataValues.user_id, "Access Request", "Tech Support Requested Access to your place");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const cancelRequest = async (req, res) => {
    const { tech_support_id, place_id } = req.params;
    try {
        await TechSupportPlace.update({
            access_type: 0,
        }, {
            where: {
                tech_support_id: tech_support_id,
                place_id: place_id,
            },
        });
        res.status(200).json({ message: "Request Cancelled" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const assignedRoomsByPlace = async (req, res) => {
    const { techSupportID, placeID } = req.params;
    try {
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export const relayUnitsOfPlace = async (req, res) => {
    const { techSupportID, placeID } = req.params;
    try {
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addRelayUnit = async (req, res) => {
    const { techSupportID, placeID } = req.params;
    const { relayUnit } = req.body;
    try {
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            console.log("Unauthorized");
            res.status(401).json({ error: "Unauthorized" });
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
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteRelayUnit = async (req, res) => {
    const { techSupportID, placeID, relayUnitID } = req.params;
    try {
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const getDevicesOfRoom = async (req, res) => {
    const { techSupportID, placeID, roomID } = req.params;
    try {
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
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
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            console.log("Unauthorized");
            res.status(401).json({ error: "Unauthorized" });
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
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const deleteDevice = async (req, res) => {
    const { techSupportID, placeID, roomID, deviceID } = req.params;
    try {
        if (await hasAccess(techSupportID, placeID)) {
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
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const getSensorUnitOfRoom = async (req, res) => {
    const { techSupportID, placeID, roomID } = req.params;
    try {
        if (await hasAccess(techSupportID, placeID)) {
            if (isAssignedToPlace(techSupportID, placeID)) {
                const sensorUnit = await SensorUnit.findOne({
                    where: {
                        room_id: roomID,
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "room_id"]
                    },
                });
                res.status(200).json(sensorUnit?.dataValues);
            } else {
                res.status(403).json({ error: "Forbidden" });
            }
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const getSensorData = async (req, res) => {
    const { sensorUnitID, limit } = req.params;
    try {
        const sensorData = await SensorData.findAll({
            where: {
                sensor_unit_id: sensorUnitID,
            },
            order: [["updatedAt", "DESC"]],
            limit: limit,
        });
        res.status(200).json(sensorData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const updateSensorUnit = async (req, res) => {
    const { roomID, sensorUnitID } = req.params;
    const { sensorUnit } = req.body;
    try {
        await SensorUnit.update({
            ...sensorUnit,
        }, {
            where: {
                sensor_unit_id: sensorUnitID,
                room_id: roomID,
            },
        });
        res.status(200).json(sensorUnit);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

export const getAvilUnitCount = async (req, res) => {
    try {
        const { customerID, type } = req.params;
        const units = await OwnedItem.findByPk(customerID);
        if (!units) return res.status(404).json({ error: "Not Found" });
        if (type === "relay") {
            const places = await CustomerPlace.findAll({
                where: {
                    user_id: customerID,
                },
                attributes: ["place_id"],
            });
            const relayUnits = await RelayUnit.count({
                where: {
                    place_id: places.map((place) => place.place_id),
                }
            });
            res.status(200).json({ count: ((+units.relay_units) - (+relayUnits)) });
        } else if (type === "sensor") {
            const [sensor_units, metadata] = await sequelize.query(`SELECT COUNT(DISTINCT sensor_units.sensor_unit_id) FROM sensor_units, rooms, customer_places WHERE sensor_units.room_id = rooms.room_id AND rooms.place_id = customer_places.place_id AND customer_places.user_id = ${customerID}`);
            res.status(200).json({ count: ((+units.sensor_units) - (+sensor_units[0].count)) });
        } else {
            res.status(400).json({ error: "Bad Request" });
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
            access_type: 1,
        },
    });
    if (isAssigned?.length !== 0) {
        return true;
    } else {
        return false;
    }
}

async function hasAccess(tech_support_id, place_id) {
    const access = await TechSupportPlace.findOne({
        where: {
            tech_support_id,
            place_id,
        }
    });
    if (access.dataValues.access_type === 1) {
        return true;
    } else {
        return false;
    }
}