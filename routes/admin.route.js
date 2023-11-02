import Express from "express";
import { getCustomerView } from "../controllers/adminCustomer.controller.js";
import { getTechSupportView } from "../controllers/adminTechSupport.controller.js";
import { getItemsView } from "../controllers/adminItems.controller.js";
import { getPaymentsView } from "../controllers/adminPayments.controller.js";
import { getComplaintsView, getComplaintInfo, updateComplaint } from "../controllers/adminComplaints.controller.js";

const router = Express.Router();

router.get("/customerView", getCustomerView);
router.get("/techSupportView", getTechSupportView);
router.get("/itemsView", getItemsView);
router.get("/paymentsView", getPaymentsView);
router.get("/complaintView", getComplaintsView);
router.get("/complaintInfo/:complaintId", getComplaintInfo);
router.put("/complaintEdit/:complaintId", updateComplaint);

export default router;

