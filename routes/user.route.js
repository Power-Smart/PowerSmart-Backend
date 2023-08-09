import Express from "express";
import {
    getUser,
    saveProfile,
    updateCustomerProfile,
    completeCustomerProfile
} from "../controllers/user.controller.js";
import { picDelete, profileUpload } from "../config/multer.config.js";


const router = Express.Router();

router.get("/:id", getUser);
router.patch("/customer_profile/:id", updateCustomerProfile);
router.post("/saveProfilePic/:id", profileUpload, saveProfile);
router.delete("/deleteProfilePic/:picName",picDelete)
router.post("/customer/addProfileInfo",completeCustomerProfile);

export default router;
