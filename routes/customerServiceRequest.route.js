import Express from "express";
import { getCustomerServiceRequests } from "../controllers/customerServiceRequest.controller.js";

const router = Express.Router();

router.get("/:techSupportID", getCustomerServiceRequests);

export default router;