import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';
import { StockModel } from '../src/modules/inventory/stock.model';

describe('Purchase Receipt', () => {
  it('confirm purchase increases stock', async () => {
    const productId = new mongoose.Types.ObjectId();

    const createRes = await request(app)
      .post('/purchase-receipts')
      .send({
        supplier_id: new mongoose.Types.ObjectId(),
        warehouse_id: new mongoose.Types.ObjectId(),
        receipt_date: new Date(),
        currency: 'USD',
        lines: [
          { product_id: productId, quantity: 5, unit_price: 10 }
        ],
      });

    const receiptId = createRes.body._id;

    await request(app)
      .put(`/purchase-receipts/${receiptId}/confirm`)
      .send({});

    const stock = await StockModel.findOne({ product_id: productId });
    expect(stock?.quantity).toBe(5);
  });
});
