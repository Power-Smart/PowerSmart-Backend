import { getCustomerDetails } from '../controllers/customer.controller.js';
import Express from 'express';  

const router = Express.Router();

router.get("/:customerID",getCustomerDetails);


export default router;