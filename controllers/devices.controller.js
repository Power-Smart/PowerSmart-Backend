import Device from "../models/device.model.js";
import DeviceSwitching from "../models/deviceSwitching.model.js";

export const getDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({
            where: {
                room_id: req.params.roomID,
                is_active: true,
            },
        });
        const deviceSwitches = await DeviceSwitching.findAll({
            include: { model: Device, as: "device" },
            where: {
                device_id: devices.map((device) => device.device_id),
                status: ["active", "active pending"],
            },
        });
        res.status(200).json(deviceSwitches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
