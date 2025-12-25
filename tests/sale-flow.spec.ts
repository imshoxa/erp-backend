import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import { StockModel } from '../src/modules/inventory/stock.model';

describe('Sale flow', () => {
    it('confirm sale decreases stock and cancel restores it', async () => {
        const productId = new mongoose.Types.ObjectId();
        const warehouseId = new mongoose.Types.ObjectId();

        // purchase
        const purchase = await request(app)
            .post('/purchase-receipts')
            .send({
                supplier_id: new mongoose.Types.ObjectId(),
                warehouse_id: warehouseId,
                receipt_date: new Date(),
                currency: 'USD',
                lines: [
                    { product_id: productId, quantity: 10, unit_price: 5 }
                ],
            });

        await request(app)
            .put(`/purchase-receipts/${purchase.body._id}/confirm`)
            .send({});

        // sale
        const sale = await request(app)
            .post('/sales')
            .send({
                warehouse_id: warehouseId,
                sale_date: new Date(),
                currency: 'USD',
                lines: [
                    { product_id: productId, quantity: 4, unit_price: 8 }
                ],
            });

        await request(app)
            .put(`/sales/${sale.body._id}/confirm`)
            .send({});

        // after confirm
        let stocks = await StockModel.find({ product_id: productId });
        let totalQty = stocks.reduce((sum, s) => sum + s.quantity, 0);
        expect(totalQty).toBe(6);

        // cancel sale
        await request(app)
            .put(`/sales/${sale.body._id}/cancel`)
            .send({ reason: 'test cancel' });

        // after cancel
        stocks = await StockModel.find({ product_id: productId });
        totalQty = stocks.reduce((sum, s) => sum + s.quantity, 0);
        expect(totalQty).toBe(10);
    });
});
