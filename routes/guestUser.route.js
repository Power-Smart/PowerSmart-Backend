import Express from "express";
import { addGuestUserSuggest,getGuestUserSuggest } from "../controllers/guestuser.controller.js";

const router = Express.Router();

router.post("/", addGuestUserSuggest);
router.get("/:customerID", getGuestUserSuggest);

export default router;