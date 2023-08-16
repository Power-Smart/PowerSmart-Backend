import Device from "../models/device.model.js";
import DeviceSwitching from "../models/deviceSwitching.model.js";

export const getDevicesData = async (req, res) => {
    try {
        const devices = await Device.findAll({
            where: {
                room_id: req.params.roomID,
                is_active: true,
            },
        });
        const deviceSwitches = await DeviceSwitching.findAll({
            where: {
                device_id: devices.map((device) => device.device_id),
                status: ["active", "active_pending"],
            },
            order: [["createdAt", "ASC"]],
        });
        devices.forEach((device) => {
            deviceSwitches.forEach((deviceSwitch) => {
                if (device.device_id === deviceSwitch.device_id) {
                    device.dataValues.deviceSwitch = deviceSwitch;
                }
            });
        });
        res.status(200).json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDevice = async (req, res) => {
    try {
        const device = await Device.findOne({
            where: {
                device_id: req.params.deviceID,
                is_active: true,
            },
        });
        const deviceSwitch = await DeviceSwitching.findOne({
            // include : {model : Device, as : "device"},
            where: {
                device_id: req.params.device_id,
                status: ["active", "active_pending"],
            },
        });
        res.status(200).json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const toggleDevice = async (req, res) => {
    const { deviceID, status } = req.params;
    try {
        res.status(200).json({ message: "Device toggled" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

