import Express from "express";
import {
    login,
    register,
    refreshToken,
    logout,
} from "../controllers/auth.controller.js";

const router = Express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/token", refreshToken);
router.delete("/logout", logout);

export default router;
