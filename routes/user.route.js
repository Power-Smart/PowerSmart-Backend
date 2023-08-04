import Express from "express";
import { getUser, saveProfile } from "../controllers/user.controller.js";
import { profileUpload } from "../config/multer.config.js";


const router = Express.Router();

router.get("/:id", getUser);
router.post("/saveProfilePic/:id", profileUpload, saveProfile);

export default router;
