import Express from "express";
import {
    assignedCustomers,
    assignedPlacesByCustomer,
    assignedRoomsByPlace,
    relayUnitsOfPlace,
    addRelayUnit,
    updateRelayUnit
} from "../controllers/techAssigns.controller.js";

const router = Express.Router();

router.get("/customers/:techSupportID", assignedCustomers)
router.get("/places/:techSupportID/:customerID", assignedPlacesByCustomer);
router.get("/rooms/:techSupportID/:placeID", assignedRoomsByPlace);

router.get("/relayunits/:techSupportID/:placeID", relayUnitsOfPlace);
router.post("/relayunits/:techSupportID/:placeID", addRelayUnit);
router.put("/relayunits/:techSupportID/:placeID/:relayUnitID", updateRelayUnit);

export default router;