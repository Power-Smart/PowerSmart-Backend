import Express from "express";
import { addGuestUserSuggest } from "../controllers/guestuser.controller.js";

const router = Express.Router();

router.post("/", addGuestUserSuggest);

export default router;