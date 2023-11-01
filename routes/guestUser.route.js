import Express from "express";
import { addGuestUser,takeActionAndNotWant,sendSMSWhenAcceptGusetUserRequest,sendSMSWhenRejectGusetUserRequest,addNewGuestUserSuggest,getAllGuestUser,banAndUnbanGuestUser,getAllGuestSuggest } from "../controllers/guestuser.controller.js";

const router = Express.Router();

router.post("/", addGuestUser);
router.post("/addSuggest", addNewGuestUserSuggest);
router.post("/banAndUnbanGuestUser", banAndUnbanGuestUser);
router.get("/allSuggest/:customerID", getAllGuestSuggest);
router.post("/takeActionAndNotWant", takeActionAndNotWant);
router.get("/allGuestUser/:customerID", getAllGuestUser);
router.post("/sendSMSWhenAcceptGusetUserRequest", sendSMSWhenAcceptGusetUserRequest);
router.post("/sendSMSWhenRejectGusetUserRequest", sendSMSWhenRejectGusetUserRequest);


// router.get("/allGuestUser/:customerID", getGuestUserSuggest);


export default router;