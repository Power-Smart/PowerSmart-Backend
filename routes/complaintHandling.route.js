import Express from "express";
import { getComplaintHandling } from "../controllers/complaintHandling.controller.js";

const router = Express.Router();

router.get("/:techSupportID", getComplaintHandling);

export default router;