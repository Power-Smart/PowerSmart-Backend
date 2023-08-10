import authRouter from "./auth.route.js";
import mainRouter from "./main.route.js";
import userRouter from "./user.route.js";
import placesRouter from "./places.route.js";
import roomsRouter from "./room.route.js";


import Express from "express";
const router = Express.Router();

router.use("/", mainRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/places", placesRouter);
router.use("/places/rooms",roomsRouter);

export default router;
