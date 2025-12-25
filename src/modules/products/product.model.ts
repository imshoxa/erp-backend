import { Schema, model } from 'mongoose';
import { ProductTrackingType } from '../../common/enums';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    unit_of_measure: { type: String, required: true },

    tracking_type: {
      type: String,
      enum: Object.values(ProductTrackingType),
      required: true,
    },

    is_active: { type: Boolean, default: true },

    barcode: { type: String },
    min_stock_level: { type: Number },
    sale_price_default: { type: Number },
    purchase_price_default: { type: Number },

    // VARIANT
    parent_product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },

    variant_attributes: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

export const ProductModel = model('Product', ProductSchema);
