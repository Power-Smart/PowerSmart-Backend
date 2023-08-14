import Express from "express";
import { getDevices } from "../controllers/devices.controller.js";

const router = Express.Router();

router.get("/:userID/:roomID", getDevices);

export default router;
