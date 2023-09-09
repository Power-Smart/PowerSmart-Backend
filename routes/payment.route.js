import Express from "express";
import {
    checkoutPayment,
    getUserDetails,
    getOrdersForCustomer,
    getOrdersForTechSupport,
    calTotal,
} from "../controllers/payment.controller.js";

const router = Express.Router();


router.post("/customer/total/:cusId", calTotal);

router.get("/customer/bill_details/:cusId", getUserDetails);
router.get("/customer/:cusId", getOrdersForCustomer);

router.get("/techsupport/:tchID", getOrdersForTechSupport);

router.post("/checkout", checkoutPayment);

export default router;
