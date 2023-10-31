import Express from "express";
import { getCustomerView } from "../controllers/adminCustomer.controller.js";
import { getTechSupportView } from "../controllers/adminTechSupport.controller.js";
import { getItemsView } from "../controllers/adminItems.controller.js";

const router = Express.Router();

router.get("/customerView", getCustomerView);
router.get("/techSupportView", getTechSupportView);
router.get("/itemsView", getItemsView );

export default router;