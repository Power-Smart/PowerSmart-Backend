import Express from "express";
import { getAssignedTechSupportForCustomer } from "../controllers/assignedTechSupportForCustomer.controller.js";
import { getChatHistoryOfCustomerTechSupportSenderMsg, getChatHistoryOfCustomerTechSupportReceiverMsg,sendMsgToTechSupportByCustomer,sendMsgToCustomerByTechSupport } from "../controllers/chat.controller.js";


const router = Express.Router();

router.get("/getAssignedTechSupport/:customerID", getAssignedTechSupportForCustomer);
router.get("/getChatHistoryofCustomerTechSupportSenderMsg/:customerID/:techSupportID", getChatHistoryOfCustomerTechSupportSenderMsg);
router.get("/getChatHistoryofCustomerTechSupportReceiverMsg/:customerID/:techSupportID", getChatHistoryOfCustomerTechSupportReceiverMsg);
router.post("/sendMsgToTechSupport", sendMsgToTechSupportByCustomer);
router.post("/sendMsgToCustomer", sendMsgToCustomerByTechSupport);



export default router;
