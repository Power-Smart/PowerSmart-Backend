import Express from "express";
import { createSchedule, deleteSchedule, getSchedules, updateSchedule } from "../controllers/schedule.controller.js";

const router = Express.Router();

router.get("/get_schedules/:userId/:deviceId", getSchedules);
router.post("/create", createSchedule);

export default router;
