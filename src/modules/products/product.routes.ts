import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();
const controller = new ProductController();

router.post('/', controller.create);
router.get('/', controller.list);
router.put('/:id', controller.update);


export default router;
