import Express from "express";
import authRouter from "./auth.route.js";
import mainRouter from "./main.route.js";
import userRouter from "./user.route.js";
import placesRouter from "./places.route.js";
import roomsRouter from "./room.route.js";
import paymentRouter from "./payment.route.js";
import deviceRouter from "./device.route.js";
import reportsRouter from "./report.route.js";

const router = Express.Router();

router.use("/", mainRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/places", placesRouter);
router.use("/places/rooms", roomsRouter);
router.use("/devices", deviceRouter);
router.use("/payment", paymentRouter);
router.use("/reports", reportsRouter);

export default router;
