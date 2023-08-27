import Express from "express";
import { assignedCustomers, assignedPlacesByCustomer, assignedRoomsByPlace, relayUnitsOfPlace } from "../controllers/techAssigns.controller.js";

const router = Express.Router();

router.get("/customers/:techSupportID", assignedCustomers)
router.get("/places/:techSupportID/:customerID", assignedPlacesByCustomer);
router.get("/rooms/:techSupportID/:placeID", assignedRoomsByPlace);
router.get("/relayunits/:techSupportID/:placeID", relayUnitsOfPlace);

export default router;