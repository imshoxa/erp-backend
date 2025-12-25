import { ProductModel } from './product.model';
import { AppError } from '../../common/errors';

export class ProductService {
    async create(data: any) {
        const exists = await ProductModel.findOne({ sku: data.sku });
        if (exists) {
            throw new AppError('SKU_EXISTS', 'SKU already exists', 'sku');
        }

        // ERP rule: VARIANT product must have variant_attributes
        if (
            data.tracking_type === 'VARIANT' &&
            (!data.variant_attributes || Object.keys(data.variant_attributes).length === 0)
        ) {
            throw new AppError(
                'VARIANT_ATTRIBUTES_REQUIRED',
                'Variant product must have variant_attributes',
                'variant_attributes'
            );
        }
        // ERP rule: VARIANT parent is not sellable / not active
        if (data.tracking_type === 'VARIANT') {
            data.is_active = false;
        }
        // ERP rule: non-VARIANT products must NOT have variant_attributes
        if (
            data.tracking_type !== 'VARIANT' &&
            data.variant_attributes &&
            Object.keys(data.variant_attributes).length > 0
        ) {
            throw new AppError(
                'VARIANT_ATTRIBUTES_NOT_ALLOWED',
                'variant_attributes allowed only for VARIANT products',
                'variant_attributes'
            );
        }

        return ProductModel.create(data);
    }


    async getAll() {
        return ProductModel.find({ is_active: true });
    }

    
    async update(productId: string, data: any) {
        const product = await ProductModel.findById(productId);
      
        if (!product) {
          throw new AppError('PRODUCT_NOT_FOUND', 'Product not found');
        }
      
        // ERP rule: tracking_type cannot be changed after creation
        if (
          data.tracking_type &&
          data.tracking_type !== product.tracking_type
        ) {
          throw new AppError(
            'TRACKING_TYPE_IMMUTABLE',
            'tracking_type cannot be changed once product is created',
            'tracking_type'
          );
        }
      
        Object.assign(product, data);
        return product.save();
      }
      
}

