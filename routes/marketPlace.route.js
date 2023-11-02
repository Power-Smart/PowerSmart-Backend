import Express from "express";
import {getMarketPlaceItems,sendCustomerPaymentSummaryApi} from "../controllers/marketPlace.controller.js";

const router = Express.Router();

router.get("/", getMarketPlaceItems);
router.post("/paymentSummary", sendCustomerPaymentSummaryApi);


export default router;