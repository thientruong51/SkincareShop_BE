import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(orderData: Partial<Order>): Promise<OrderDocument> {
    const newOrder = new this.orderModel(orderData);
    return newOrder.save();
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId })
      .populate('items.productId', 'name')
      .exec();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('items.productId', 'name')
      .populate('userId', '_id name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel
      .findById(id)
      .populate('items.productId', 'name')
      .populate('userId', '_id name email')
      .exec();
  }

  async update(id: string, updateData: Partial<Order>): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('items.productId', 'name')
      .exec();
  }

  async delete(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }

  async getMonthlyTotals() {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }

  async getOverallTotal() {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);
    return result.length > 0 ? result[0].totalAmount : 0;
  }

  async getTotals() {
    const monthlyTotals = await this.getMonthlyTotals();
    const overallTotal = await this.getOverallTotal();
    return { monthlyTotals, overallTotal };
  }
}
