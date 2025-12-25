import { Schema, model, Types } from 'mongoose';

const StockSchema = new Schema(
  {
    product_id: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    warehouse_id: {
      type: Types.ObjectId,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    // tracking layer
    serial_number: String,
    lot_code: String,
    expiration_date: Date,
  },
  {
    timestamps: true,
  }
);

export const StockModel = model('Stock', StockSchema);
