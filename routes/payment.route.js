import Express from "express";
import {
    checkoutPayment,
    getBillDetails,
    getOrdersForCustomer,
    getOrdersForTechSupport,
} from "../controllers/payment.controller.js";

const router = Express.Router();

router.get("/customer/bill_details/:cusId", getBillDetails);
router.get("/customer/:cusId", getOrdersForCustomer);

router.get("/techsupport/:tchID", getOrdersForTechSupport);

router.post("/checkout", checkoutPayment);

export default router;
