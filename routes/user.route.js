import Express from "express";
import {
    getUser,
    saveProfile,
    updateCustomerProfile,
} from "../controllers/user.controller.js";
import { profileUpload } from "../config/multer.config.js";

const router = Express.Router();

router.get("/:id", getUser);
router.patch("/customer_profile/:id", updateCustomerProfile);
router.post("/saveProfilePic/:id", profileUpload, saveProfile);

export default router;
