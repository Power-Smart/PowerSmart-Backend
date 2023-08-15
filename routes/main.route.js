import Express from "express";
import { handleSensorData } from "../controllers/control.controller.js";
import { getRoot, testInsert } from "../controllers/main.controller.js";

const router = Express.Router();

router.get("/", getRoot);
router.get("/test", testInsert);
router.post("/sensorcontrol/:id", handleSensorData);

export default router;
