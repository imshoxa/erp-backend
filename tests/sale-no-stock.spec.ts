import request from 'supertest';
import { app } from '../src/app';
import mongoose from 'mongoose';

describe('Sale without stock', () => {
  it('should fail when no stock', async () => {
    const productId = new mongoose.Types.ObjectId();

    const saleRes = await request(app)
      .post('/sales')
      .send({
        warehouse_id: new mongoose.Types.ObjectId(),
        sale_date: new Date(),
        currency: 'USD',
        lines: [
          { product_id: productId, quantity: 1, unit_price: 10 }
        ],
      });

    const saleId = saleRes.body._id;

    const confirmRes = await request(app)
      .put(`/sales/${saleId}/confirm`)
      .send({});

    expect(confirmRes.status).toBe(400);
  });
});
