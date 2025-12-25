import { Schema, model, Types } from 'mongoose';
import { DocumentStatus } from '../../common/enums';

const PurchaseReceiptSchema = new Schema(
  {
    supplier_id: {
      type: Types.ObjectId,
      required: true,
    },

    warehouse_id: {
      type: Types.ObjectId,
      required: true,
    },

    receipt_date: {
      type: Date,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.DRAFT,
    },

    lines: [
      {
        product_id: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        unit_price: {
          type: Number,
          required: true,
        },

        serial_number: String,
        lot_code: String,
        expiration_date: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const PurchaseReceiptModel = model(
  'PurchaseReceipt',
  PurchaseReceiptSchema
);
