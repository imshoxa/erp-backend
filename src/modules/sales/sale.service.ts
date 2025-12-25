import { SaleModel } from './sale.model';
import { InventoryService } from '../inventory/inventory.service';
import { AppError } from '../../common/errors';
import { DocumentStatus } from '../../common/enums';

export class SaleService {
  private inventory = new InventoryService();

  async create(data: any) {
    return SaleModel.create(data);
  }

  async confirm(saleId: string) {
    const sale = await SaleModel.findById(saleId);

    if (!sale) {
      throw new AppError(
        'SALE_NOT_FOUND',
        'Sale not found'
      );
    }

    if (sale.status !== DocumentStatus.DRAFT) {
      throw new AppError(
        'INVALID_STATUS',
        'Only DRAFT sale can be confirmed'
      );
    }

    // availability check + stock decrease
    for (const line of sale.lines) {
      await this.inventory.checkAvailability({
        product_id: line.product_id.toString(),
        warehouse_id: sale.warehouse_id.toString(),
        quantity: line.quantity,
        serial_number: line.serial_number ?? undefined,
        lot_code: line.lot_code ?? undefined,
        expiration_date: line.expiration_date ?? undefined,
      });

      await this.inventory.decreaseStock({
        product_id: line.product_id.toString(),
        warehouse_id: sale.warehouse_id.toString(),
        quantity: line.quantity,
        serial_number: line.serial_number ?? undefined,
        lot_code: line.lot_code ?? undefined,
        expiration_date: line.expiration_date ?? undefined,
      });
    }

    sale.status = DocumentStatus.CONFIRMED;
    return sale.save();
  }
  async cancel(saleId: string, reason: string) {
    const sale = await SaleModel.findById(saleId);
  
    if (!sale) {
      throw new AppError(
        'SALE_NOT_FOUND',
        'Sale not found'
      );
    }
  
    if (sale.status !== DocumentStatus.CONFIRMED) {
      throw new AppError(
        'INVALID_STATUS',
        'Only CONFIRMED sale can be cancelled'
      );
    }
  
    if (!reason) {
      throw new AppError(
        'CANCELLATION_REASON_REQUIRED',
        'Cancellation reason is required',
        'reason'
      );
    }
  
    // restore stock
    for (const line of sale.lines) {
      await this.inventory.increaseStock({
        product_id: line.product_id.toString(),
        warehouse_id: sale.warehouse_id.toString(),
        quantity: line.quantity,
        serial_number: line.serial_number ?? undefined,
        lot_code: line.lot_code ?? undefined,
        expiration_date: line.expiration_date ?? undefined,
      });
    }
  
    sale.status = DocumentStatus.CANCELLED;
    return sale.save();
  }
  
}
