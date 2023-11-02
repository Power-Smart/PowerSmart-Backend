import Express from "express";
import { getCustomerOrderRequests,deleteCustomerOrderRequest,addCustomerOrderRequest } from "../controllers/customerOrderRequest.controller.js";

const router = Express.Router();

router.get("/", getCustomerOrderRequests);
router.post("/addOrder", addCustomerOrderRequest);
router.get("/deleteOrder/:orderID", deleteCustomerOrderRequest);


export default router;