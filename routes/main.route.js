import Express from "express";
import { getRoot, testInsert } from "../controllers/main.controller.js";

const router = Express.Router();

router.get("/", getRoot);
router.get("/test", testInsert);

export default router;
