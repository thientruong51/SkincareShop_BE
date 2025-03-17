// reviews/reviews.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from '../interfaces/user.interface';
import { Review } from './schemas/reviews.schema';
import { Product } from 'src/products/schemas/products.schema';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async hasUserReviewedProduct(userId: string, productId: string): Promise<boolean> {
    const review = await this.reviewModel.findOne({
      userId,
      productId,
    });
    
    return !!review;
  }

  async create(
  productId: string,
  createReviewDto: CreateReviewDto,
  user: IUser,
): Promise<Review> {
  // Check if product exists
  const product = await this.productModel.findById(productId);
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  // Check if user already reviewed this product using the new method
  const hasReviewed = await this.hasUserReviewedProduct(user._id, productId);
  if (hasReviewed) {
    throw new ConflictException('You have already reviewed this product');
  }

  try {
    // Create new review
    const review = new this.reviewModel({
      userId: user._id,
      productId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
    });

    await review.save();
    
    // Update product's average rating
    await this.updateProductAverageRating(productId);
    
    return review;
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictException('You have already reviewed this product');
    }
    throw error;
  }
}

  async findAllByProduct(productId: string): Promise<Review[]> {
    // Check if product exists
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    return this.reviewModel
      .find({ productId })
      .populate('userId', 'name') // Only include user's name
      .sort({ createdAt: -1 }) // Latest reviews first
      .exec();
  }

  private async updateProductAverageRating(productId: string): Promise<void> {
    const reviews = await this.reviewModel.find({ productId });
    
    if (reviews.length === 0) {
      await this.productModel.findByIdAndUpdate(productId, { averageRating: 0 });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update product with new average rating (rounded to 1 decimal place)
    await this.productModel.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
    });
  }

  async deleteReview(reviewId: string, user: IUser): Promise<void> {
    const review = await this.reviewModel.findById(reviewId);
    
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    
    // Verify the user is the owner of the review or an admin
    if (review.userId.toString() !== user._id && user.role !== 'admin') {
      throw new NotFoundException('Review not found or access denied');
    }
    
    await this.reviewModel.findByIdAndDelete(reviewId);
    
    // Update the product's average rating
    await this.updateProductAverageRating(review.productId.toString());
  }
}