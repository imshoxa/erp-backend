import { Request, Response } from 'express';
import { ProductService } from './product.service';

const service = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    const product = await service.create(req.body);
    res.status(201).json(product);
  }

  async list(_req: Request, res: Response) {
    const products = await service.getAll();
    res.json(products);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const product = await service.update(id, req.body);
    res.json(product);
  }
}
