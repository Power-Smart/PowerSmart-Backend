import {getRooms} from '../controllers/rooms.controller.js';
import Express from 'express';  


const router = Express.Router();

router.get("/:customerID/:placeID",getRooms);


export default router;