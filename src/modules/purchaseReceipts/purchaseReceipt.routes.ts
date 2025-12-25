import { Router } from 'express';
import { PurchaseReceiptController } from './purchaseReceipt.controller';

const router = Router();
const controller = new PurchaseReceiptController();

router.post('/', controller.create);
router.put('/:id/confirm', controller.confirm);
router.put('/:id/cancel', controller.cancel);


export default router;
