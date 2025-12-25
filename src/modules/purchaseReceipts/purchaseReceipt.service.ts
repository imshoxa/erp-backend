import { PurchaseReceiptModel } from './purchaseReceipt.model';
import { InventoryService } from '../inventory/inventory.service';
import { AppError } from '../../common/errors';
import { DocumentStatus } from '../../common/enums';

export class PurchaseReceiptService {
  private inventory = new InventoryService();

  async create(data: any) {
    return PurchaseReceiptModel.create(data);
  }

  async confirm(receiptId: string) {
    const receipt = await PurchaseReceiptModel.findById(receiptId);

    if (!receipt) {
      throw new AppError(
        'RECEIPT_NOT_FOUND',
        'Purchase receipt not found'
      );
    }

    if (receipt.status !== DocumentStatus.DRAFT) {
      throw new AppError(
        'INVALID_STATUS',
        'Only DRAFT receipt can be confirmed'
      );
    }

    for (const line of receipt.lines) {
      await this.inventory.increaseStock({
        product_id: line.product_id.toString(),
        warehouse_id: receipt.warehouse_id.toString(),
        quantity: line.quantity,
        serial_number: line.serial_number ?? undefined,
        lot_code: line.lot_code ?? undefined,
        expiration_date: line.expiration_date ?? undefined,
      });
    }

    receipt.status = DocumentStatus.CONFIRMED;
    return receipt.save();
  }
  async cancel(receiptId: string, reason: string) {
    const receipt = await PurchaseReceiptModel.findById(receiptId);
  
    if (!receipt) {
      throw new AppError(
        'RECEIPT_NOT_FOUND',
        'Purchase receipt not found'
      );
    }
  
    if (receipt.status !== DocumentStatus.CONFIRMED) {
      throw new AppError(
        'INVALID_STATUS',
        'Only CONFIRMED receipt can be cancelled'
      );
    }
  
    if (!reason) {
      throw new AppError(
        'CANCELLATION_REASON_REQUIRED',
        'Cancellation reason is required',
        'cancellation_reason'
      );
    }
  
    // rollback stock
    for (const line of receipt.lines) {
      await this.inventory.decreaseStock({
        product_id: line.product_id.toString(),
        warehouse_id: receipt.warehouse_id.toString(),
        quantity: line.quantity,
        serial_number: line.serial_number ?? undefined,
        lot_code: line.lot_code ?? undefined,
        expiration_date: line.expiration_date ?? undefined,
      });
    }
  
    receipt.status = DocumentStatus.CANCELLED;
    
  
    return receipt.save();
  }
}
