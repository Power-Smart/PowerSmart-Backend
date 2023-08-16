import Device from "../models/device.model.js";
import DeviceSwitching from "../models/deviceSwitching.model.js";
import db from "../models/index.js";
import _ from "lodash";

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
        const [relaySocket, metadata] = await db.query(`SELECT relay_unit_id, socket FROM devices WHERE device_id=${deviceID}`);
        console.log("relaySocket : ", relaySocket);
        const wsDataToSendOnce = {
            switchingScheme: {
                [relaySocket[0].relay_unit_id]: {
                    [relaySocket[0].socket]: status
                }
            }
        };

        console.log("wsDataToSendOnce : ", wsDataToSendOnce);

        fetch('http://20.253.48.86:4001/relayswitch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wsDataToSendOnce)
        })
            .then((response) => response.json())
            .then(async (data) => {
                console.log("data : ", data)
                if (_.isEmpty(data.notFoundRelays)) {
                    await DeviceSwitching.update({
                        switch_status: status,
                    }, {
                        where: {
                            device_id: deviceID,
                            status: "active",
                        }
                    });
                } else {
                    throw new Error("Relay not found");
                }
                res.status(200).json({ message: "Device toggled" });
            })
            .catch((err) => res.status(500).json({ error: err.message }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

