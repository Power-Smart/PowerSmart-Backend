import Express from "express";
import {
    controlAccess,
    restrictAccess,
    techSupportAccess
} from "../controllers/access.controller.js";

const router = Express.Router();

router.get("/requests/:userID", techSupportAccess);
router.post("/restrict_access/:userID", restrictAccess);
router.post("/control_access/:userID", controlAccess);

export default router;
