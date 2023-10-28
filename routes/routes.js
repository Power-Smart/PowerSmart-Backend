import Express from "express";
import authRouter from "./auth.route.js";
import mainRouter from "./main.route.js";
import userRouter from "./user.route.js";
import placesRouter from "./places.route.js";
import roomsRouter from "./room.route.js";
import paymentRouter from "./payment.route.js";
import deviceRouter from "./device.route.js";
import techAssignRouter from "./techAssigns.route.js";
import marketplaceRouter from "./marketPlace.route.js";
import customerOrderRequestRouter from "./customerOrderRequest.route.js";
import sensor_data from "./sensor_data.route.js";
import scheduling from "./scheduling.route.js";

import techRatingByCustomersRouter from "./techRatingByCustomers.route.js";
import complaintHandlingRouter from "./complaintHandling.route.js";
import customerServiceRequestRouter from "./customerServiceRequest.route.js";


const router = Express.Router();

router.use("/", mainRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/places", placesRouter);
router.use("/places/rooms", roomsRouter);
router.use("/devices", deviceRouter);
router.use("/payment", paymentRouter);
router.use("/assigns", techAssignRouter)
router.use("/marketplace", marketplaceRouter);
router.use('/customerOrderRequests', customerOrderRequestRouter);
router.use("/sensor_data", sensor_data);
router.use("/scheduling", scheduling)

router.use('/techSupportRatingByCustomers', techRatingByCustomersRouter);
router.use('/complaintHandling', complaintHandlingRouter);
router.use('/customerServiceRequest', customerServiceRequestRouter);


export default router;
