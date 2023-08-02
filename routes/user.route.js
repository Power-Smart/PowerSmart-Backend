import Express from "express";
import { getUser } from "../controllers/user.controller.js";

const router = Express.Router();

router.get("/:id", getUser);

export default router;
