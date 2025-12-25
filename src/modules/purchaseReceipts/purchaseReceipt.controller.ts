import { Request, Response } from 'express';
import { PurchaseReceiptService } from './purchaseReceipt.service';

const service = new PurchaseReceiptService();

export class PurchaseReceiptController {
  async create(req: Request, res: Response) {
    const receipt = await service.create(req.body);
    res.status(201).json(receipt);
  }

  async confirm(req: Request, res: Response) {
    const { id } = req.params;
    const receipt = await service.confirm(id);
    res.json(receipt);
  }
  
  async cancel(req: Request, res: Response) {
    const { id } = req.params;
    const { reason } = req.body;
    const receipt = await service.cancel(id, reason);
    res.json(receipt);
  }  
}
