import Express from "express";
import { addTechSupport } from "../controllers/techSupportAdd.controller.js";

const router = Express.Router();

// Change this route to handle POST requests
router.post("/", addTechSupport);

export default router;
