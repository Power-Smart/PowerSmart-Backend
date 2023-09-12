import Express from "express";
import { getDevicesData, getDevice, toggleDevice, deviceSwitch } from "../controllers/devices.controller.js";

const router = Express.Router();

router.post("/scheduledSwitch", deviceSwitch)
router.get("/toggle/:deviceID/:status", toggleDevice);
router.get("/:userID/:roomID", getDevicesData);
router.get("/:userID/:roomID/:deviceID", getDevice);

export default router;
