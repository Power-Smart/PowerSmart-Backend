import Express from "express";
import { login, register } from "../controllers/auth.controller";

const router = Express.Router();

router.post("/login", login);
router.post("/register", register);