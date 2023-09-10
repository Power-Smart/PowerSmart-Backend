import Express from "express";
import { getAssignedTechSupportForCustomer } from "../controllers/assignedTechSupportForCustomer.controller.js";
import { getChatHistoryOfCustomerTechSupportSenderMsg, getChatHistoryOfCustomerTechSupportReceiverMsg } from "../controllers/chatHistoryofCustomerTechSupport.controller.js";

const router = Express.Router();

router.get("/getAssignedTechSupport/:customerID", getAssignedTechSupportForCustomer);
router.get("/getChatHistoryofCustomerTechSupportSenderMsg/:customerID/:techSupportID", getChatHistoryOfCustomerTechSupportSenderMsg);
router.get("/getChatHistoryofCustomerTechSupportReceiverMsg/:customerID/:techSupportID", getChatHistoryOfCustomerTechSupportReceiverMsg);


export default router;
