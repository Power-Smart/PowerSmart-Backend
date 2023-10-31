import Express from 'express';  
import { getTechSupportUser, updateTechSupportProfile } from '../controllers/techSupport.controller.js';

const router = Express.Router();

router.get("/:techSupportID",getTechSupportUser);
router.patch("/techSupport_profile/:techSupportID",updateTechSupportProfile);


export default router;