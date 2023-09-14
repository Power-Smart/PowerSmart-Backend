import Express from "express";
import { createSchedule, deleteSchedule, getSchedules, updateSchedule } from "../controllers/schedule.controller.js";

const router = Express.Router();

router.get("/get_schedules/:userId/:deviceId", getSchedules);
router.post("/create/:userId", createSchedule);
router.delete("/delete/:userId/:scheduleId", deleteSchedule);
router.put("/update/:userId/:scheduleId", updateSchedule);

export default router;
