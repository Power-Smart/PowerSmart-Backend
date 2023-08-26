import Express from "express";
import { getCustomerOrderRequests,deleteCustomerOrderRequest } from "../controllers/customerOrderRequest.controller.js";

const router = Express.Router();

router.get("/", getCustomerOrderRequests);
router.get("/deleteOrder/:orderID", deleteCustomerOrderRequest);


export default router;