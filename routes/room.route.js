import {addRoom, getRooms, updateRoom} from '../controllers/rooms.controller.js';
import Express from 'express';  


const router = Express.Router();

router.get("/:customerID/:placeID",getRooms);
router.post("/add",addRoom);
router.patch("/update/:placeID/:roomID",updateRoom);


export default router;