import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

const service = new DashboardService();

export class DashboardController {
  async salesSummary(req: Request, res: Response) {
    const { from, to } = req.query;
    const data = await service.salesSummary(
      from ? new Date(String(from)) : undefined,
      to ? new Date(String(to)) : undefined
    );
    res.json(data);
  }

  async dailySales(req: Request, res: Response) {
    const { from, to } = req.query;
    const data = await service.dailySales(
      from ? new Date(String(from)) : undefined,
      to ? new Date(String(to)) : undefined
    );
    res.json(data);
  }

  async topProducts(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const data = await service.topProducts(limit);
    res.json(data);
  }

  async inventorySummary(_req: Request, res: Response) {
    const data = await service.inventorySummary();
    res.json(data);
  }

  async purchaseSummary(req: Request, res: Response) {
    const { from, to } = req.query;
    const data = await service.purchaseSummary(
      from ? new Date(String(from)) : undefined,
      to ? new Date(String(to)) : undefined
    );
    res.json(data);
  }
}
