import { Router } from 'express';
import { SaleController } from './sale.controller';


const router = Router();
const controller = new SaleController();

router.post('/', controller.create);
router.put('/:id/confirm', controller.confirm);
router.put('/:id/cancel', controller.cancel);


export default router;
