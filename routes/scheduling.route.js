import Express from "express";
import { createSchedule, deleteSchedule, getSchedules, updateSchedule, toggleActivation, getUserSchedules } from "../controllers/schedule.controller.js";

const router = Express.Router();

router.get("/get_schedules/:userId/:deviceId", getSchedules);
router.post("/create/:userId", createSchedule);
router.delete("/delete/:userId/:scheduleId", deleteSchedule);
router.put("/update/:userId/:scheduleId", updateSchedule);
router.put("/update_status/:scheduleId", toggleActivation);
router.get("/user_schedules/:userId", getUserSchedules);

export default router;
