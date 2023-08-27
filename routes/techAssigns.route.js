import Express from "express";
import {
    assignedCustomers,
    assignedPlacesByCustomer,
    assignedRoomsByPlace,
    relayUnitsOfPlace,
    addRelayUnit,
    updateRelayUnit,
    deleteRelayUnit
} from "../controllers/techAssigns.controller.js";

const router = Express.Router();

router.get("/customers/:techSupportID", assignedCustomers)
router.get("/places/:techSupportID/:customerID", assignedPlacesByCustomer);
router.get("/rooms/:techSupportID/:placeID", assignedRoomsByPlace);

router.get("/relayunits/:techSupportID/:placeID", relayUnitsOfPlace);
router.post("/relayunits/:techSupportID/:placeID", addRelayUnit);
router.put("/relayunits/:techSupportID/:placeID/:relayUnitID", updateRelayUnit);
router.delete("/relayunits/:techSupportID/:placeID/:relayUnitID", deleteRelayUnit);

export default router;