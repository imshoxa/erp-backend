import { Request, Response } from 'express';
import { SaleService } from './sale.service';

const service = new SaleService();

export class SaleController {
  async create(req: Request, res: Response) {
    const sale = await service.create(req.body);
    res.status(201).json(sale);
  }

  async confirm(req: Request, res: Response) {
    const { id } = req.params;
    const sale = await service.confirm(id);
    res.json(sale);
  }
  
  async cancel(req: Request, res: Response) {
    const { id } = req.params;
    const { reason } = req.body;
    const sale = await service.cancel(id, reason);
    res.json(sale);
  }
  
}
