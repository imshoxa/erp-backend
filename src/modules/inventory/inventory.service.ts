import { StockModel } from './stock.model';
import { AppError } from '../../common/errors';

export class InventoryService {
    async increaseStock(data: {
        product_id: string;
        warehouse_id: string;
        quantity: number;
        serial_number?: string;
        lot_code?: string;
        expiration_date?: Date;
    }) {
        // ERP rule: SERIAL numbers must be unique
        if (data.serial_number) {
            const exists = await StockModel.findOne({
                serial_number: data.serial_number,
            });

            if (exists) {
                throw new AppError(
                    'SERIAL_ALREADY_EXISTS',
                    'Serial number already exists',
                    'serial_number'
                );
            }
        }
        if (data.quantity <= 0) {
            throw new AppError(
                'INVALID_QUANTITY',
                'Quantity must be greater than zero',
                'quantity'
            );
        }

        return StockModel.create(data);
    }

    async decreaseStock(data: {
        product_id: string;
        warehouse_id: string;
        quantity: number;
        serial_number?: string;
        lot_code?: string;
        expiration_date?: Date;
    }) {
      const stock = await StockModel.findOne({
        product_id: data.product_id,
        warehouse_id: data.warehouse_id,
        serial_number: data.serial_number,
        lot_code: data.lot_code,
        expiration_date: data.expiration_date,
        quantity: { $gt: 0 },
      }).sort({ quantity: -1 });
      

        if (!stock) {
            throw new AppError(
              'STOCK_NOT_FOUND',
              'Stock record not found'
            );
          }
          
          if (stock.quantity < data.quantity) {
            throw new AppError(
              'INSUFFICIENT_STOCK',
              'Not enough stock available'
            );
          }
          

        stock.quantity -= data.quantity;
        return stock.save();
    }
    
    async checkAvailability(data: {
        product_id: string;
        warehouse_id: string;
        quantity: number;
        serial_number?: string;
        lot_code?: string;
        expiration_date?: Date;
      }) {
        const stock = await StockModel.findOne({
          product_id: data.product_id,
          warehouse_id: data.warehouse_id,
          serial_number: data.serial_number,
          lot_code: data.lot_code,
          expiration_date: data.expiration_date,
          quantity: { $gt: 0 },
        }).sort({ quantity: -1 });
        
      
        if (!stock) {
          throw new AppError(
            'STOCK_NOT_AVAILABLE',
            'Stock not available'
          );
        }
      
        if (stock.quantity < data.quantity) {
          throw new AppError(
            'INSUFFICIENT_STOCK',
            'Not enough stock available'
          );
        }
      
        return true;
      }      
}
