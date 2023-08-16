import Express from "express";
import {
    getOrdersForCustomer,
    getOrdersForTechSupport,
} from "../controllers/payment.controller.js";

const router = Express.Router();

router.get("/customer/:cusId", getOrdersForCustomer);
router.get("/techsupport/:tchID", getOrdersForTechSupport);

export default router;
