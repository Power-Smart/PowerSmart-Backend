import Express from "express";
import { getComplaintHandling,acceptOrRejectComplaint } from "../controllers/complaintHandling.controller.js";

const router = Express.Router();

router.get("/:techSupportID", getComplaintHandling);
router.patch("/accpetOrRejectComplaint", acceptOrRejectComplaint);

export default router;