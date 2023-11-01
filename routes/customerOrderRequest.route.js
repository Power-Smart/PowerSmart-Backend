import Express from "express";
import { getCustomerOrderRequests, deleteCustomerOrderRequest, addCustomerOrderRequest, acceptCustomerOrderRequest } from "../controllers/customerOrderRequest.controller.js";

const router = Express.Router();

router.get("/", getCustomerOrderRequests);
router.post("/addOrder", addCustomerOrderRequest);
router.get("/deleteOrder/:orderID", deleteCustomerOrderRequest);
router.put("/acceptOrder/:orderID/:tech_support_id/:customerID", acceptCustomerOrderRequest);


export default router;