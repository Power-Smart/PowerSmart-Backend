import {addRoom, getRooms} from '../controllers/rooms.controller.js';
import Express from 'express';  


const router = Express.Router();

router.get("/:customerID/:placeID",getRooms);
router.post("/add",addRoom);


export default router;