import Express from "express";
import { getTechSupportRating } from "../controllers/techRatingByCustomers.controller.js";

const router = Express.Router();

router.get("/:techSupportID", getTechSupportRating)

export default router;