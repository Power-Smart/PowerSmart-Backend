import Express from "express";
import {
    assignedCustomers,
    assignedPlacesByCustomer,
    assignedRoomsByPlace,
    relayUnitsOfPlace,
    addRelayUnit,
    updateRelayUnit,
    deleteRelayUnit,
    getDevicesOfRoom,
    addDevice,
    updateDevice,
    deleteDevice,
    getSensorUnitOfRoom,
    getSensorData,
    updateSensorUnit,
    getAvilUnitCount,
    requestCustomer,
    cancelRequest,
    addRoom,
    addSensorUnit,
    deleteSensorUnit
} from "../controllers/techAssigns.controller.js";

const router = Express.Router();

router.get("/customers/:techSupportID", assignedCustomers)
router.get("/places/:techSupportID/:customerID", assignedPlacesByCustomer);
router.get("/rooms/:techSupportID/:placeID", assignedRoomsByPlace);

router.get("/relayunits/:techSupportID/:placeID", relayUnitsOfPlace);
router.post("/relayunits/:techSupportID/:placeID", addRelayUnit);
router.put("/relayunits/:techSupportID/:placeID/:relayUnitID", updateRelayUnit);
router.delete("/relayunits/:techSupportID/:placeID/:relayUnitID", deleteRelayUnit);

router.get("/devices/:techSupportID/:placeID/:roomID", getDevicesOfRoom);
router.post("/devices/:techSupportID/:placeID/:roomID", addDevice);
router.put("/devices/:techSupportID/:placeID/:roomID/:deviceID", updateDevice);
router.delete("/devices/:techSupportID/:placeID/:roomID/:deviceID", deleteDevice);

router.get("/sensorunit/logs/:sensorUnitID/:limit", getSensorData);
router.put("/sensorunit/:roomID/:sensorUnitID", updateSensorUnit);
router.get("/sensorunit/:techSupportID/:placeID/:roomID", getSensorUnitOfRoom);
router.post("/sensorunit/add/:techSupportID/:roomID", addSensorUnit);
router.delete("/sensorunit/:techSupportID/:placeID/:roomID/:sensorUnitID", deleteSensorUnit);

router.get("/count/:customerID/:type", getAvilUnitCount);

router.get("/access/request/:tech_support_id/:place_id", requestCustomer);
router.get("/access/cancel/:tech_support_id/:place_id", cancelRequest);

router.post("/room/add/:tech_support_id/:placeID", addRoom);
export default router;