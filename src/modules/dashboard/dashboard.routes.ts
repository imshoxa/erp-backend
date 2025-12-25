import { Router } from 'express';
import { DashboardController } from './dashboard.controller';

const router = Router();
const controller = new DashboardController();

router.get('/sales-summary', controller.salesSummary);
router.get('/daily-sales', controller.dailySales);
router.get('/top-products', controller.topProducts);
router.get('/inventory-summary', controller.inventorySummary);
router.get('/purchase-summary', controller.purchaseSummary);

export default router;
