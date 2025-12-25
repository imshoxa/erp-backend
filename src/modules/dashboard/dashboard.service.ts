import { SaleModel } from '../sales/sale.model';
import { PurchaseReceiptModel } from '../purchaseReceipts/purchaseReceipt.model';
import { StockModel } from '../inventory/stock.model';
import { DocumentStatus } from '../../common/enums';
import { Types } from 'mongoose';

export class DashboardService {
  async salesSummary(from?: Date, to?: Date) {
    const match: any = { status: DocumentStatus.CONFIRMED };
    if (from || to) {
      match.sale_date = {};
      if (from) match.sale_date.$gte = from;
      if (to) match.sale_date.$lte = to;
    }

    const res = await SaleModel.aggregate([
      { $match: match },
      { $unwind: '$lines' },
      {
        $group: {
          _id: null,
          total_amount: {
            $sum: { $multiply: ['$lines.quantity', '$lines.unit_price'] }
          },
          count: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          _id: 0,
          total_amount: 1,
          sales_count: { $size: '$count' },
          avg_sale_value: {
            $cond: [
              { $gt: [{ $size: '$count' }, 0] },
              { $divide: ['$total_amount', { $size: '$count' }] },
              0
            ]
          }
        }
      }
    ]);

    return res[0] ?? { total_amount: 0, sales_count: 0, avg_sale_value: 0 };
  }

  async dailySales(from?: Date, to?: Date) {
    const match: any = { status: DocumentStatus.CONFIRMED };
    if (from || to) {
      match.sale_date = {};
      if (from) match.sale_date.$gte = from;
      if (to) match.sale_date.$lte = to;
    }

    return SaleModel.aggregate([
      { $match: match },
      { $unwind: '$lines' },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$sale_date' }
          },
          total_amount: {
            $sum: { $multiply: ['$lines.quantity', '$lines.unit_price'] }
          },
          count: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total_amount: 1,
          count: { $size: '$count' }
        }
      },
      { $sort: { date: 1 } }
    ]);
  }

  async topProducts(limit = 5) {
    return SaleModel.aggregate([
      { $match: { status: DocumentStatus.CONFIRMED } },
      { $unwind: '$lines' },
      {
        $group: {
          _id: '$lines.product_id',
          qty: { $sum: '$lines.quantity' },
          revenue: {
            $sum: { $multiply: ['$lines.quantity', '$lines.unit_price'] }
          }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          product_id: '$_id',
          qty: 1,
          revenue: 1
        }
      }
    ]);
  }

  async inventorySummary() {
    return StockModel.aggregate([
      {
        $group: {
          _id: '$product_id',
          total_qty: { $sum: '$quantity' }
        }
      },
      {
        $project: {
          _id: 0,
          product_id: '$_id',
          total_qty: 1
        }
      }
    ]);
  }

  async purchaseSummary(from?: Date, to?: Date) {
    const match: any = { status: DocumentStatus.CONFIRMED };
    if (from || to) {
      match.receipt_date = {};
      if (from) match.receipt_date.$gte = from;
      if (to) match.receipt_date.$lte = to;
    }

    return PurchaseReceiptModel.aggregate([
      { $match: match },
      { $unwind: '$lines' },
      {
        $group: {
          _id: null,
          total_received_amount: {
            $sum: { $multiply: ['$lines.quantity', '$lines.unit_price'] }
          },
          receipt_count: { $addToSet: '$_id' }
        }
      },
      {
        $project: {
          _id: 0,
          total_received_amount: 1,
          receipt_count: { $size: '$receipt_count' }
        }
      }
    ]);
  }
}
