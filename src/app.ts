import express from 'express';
import productRoutes from './modules/products/product.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import purchaseReceiptRoutes from './modules/purchaseReceipts/purchaseReceipt.routes';
import saleRoutes from './modules/sales/sale.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';




export const app = express();

app.use(express.json());
app.use('/products', productRoutes);
app.use(errorMiddleware);
app.use('/purchase-receipts', purchaseReceiptRoutes);
app.use('/sales', saleRoutes);
app.use('/dashboard', dashboardRoutes);



