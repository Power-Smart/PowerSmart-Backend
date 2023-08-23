import Express from "express";
import { getCustomerOrderRequests } from "../controllers/customerOrderRequest.controller.js";

const router = Express.Router();

router.get("/", getCustomerOrderRequests);

export default router;