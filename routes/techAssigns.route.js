import Express from "express";
import { assignedCustomers, assignedPlacesByCustomer } from "../controllers/techAssigns.controller.js";

const router = Express.Router();

router.get("/customers/:techSupportID", assignedCustomers)
router.get("/places/:techSupportID/:customerID", assignedPlacesByCustomer);

export default router;