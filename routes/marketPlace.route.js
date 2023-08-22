import Express from "express";
import {getMarketPlaceItems} from "../controllers/marketPlace.controller.js";

const router = Express.Router();

router.get("/", getMarketPlaceItems);

export default router;