import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PromotionSchema,
  Promotion,
  PromotionDocument,
} from './schemas/promotions.schema';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name)
    private promotionModel: Model<PromotionDocument>,
  ) {}

  async create(
    createPromotionDTO: CreatePromotionDTO,
  ): Promise<PromotionDocument> {
    const newPromotion = new this.promotionModel(createPromotionDTO);
    return newPromotion.save();
  }

  async findAll(): Promise<PromotionDocument[]> {
    return this.promotionModel.find({ isDeleted: false }).exec();
  }

  async findOne(id: string): Promise<PromotionDocument> {
    const promotion = await this.promotionModel
      .findOne({ _id: id, isDeleted: false })
      .exec();

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async update(
    id: string,
    updatePromotionDTO: UpdatePromotionDTO,
  ): Promise<Promotion> {
    const updatedPromotion = await this.promotionModel
      .findByIdAndUpdate(id, updatePromotionDTO, { new: true })
      .exec();
    if (!updatedPromotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return updatedPromotion;
  }

  async remove(id: string): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id);

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    // Soft delete by updating fields
    promotion.isDeleted = true;
    promotion.deletedAt = new Date();
    promotion.isActive = false;

    return promotion.save();
  }

  // Add a method to find active promotions
  async findAllActive(): Promise<PromotionDocument[]> {
    return this.promotionModel
      .find({
        isDeleted: false,
        isActive: true,
        endDate: { $gte: new Date() },
      })
      .exec();
  }
}
