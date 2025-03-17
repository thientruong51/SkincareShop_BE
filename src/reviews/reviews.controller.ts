// reviews/reviews.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

import { User } from '../decorators/user.decorator'; // Changed to use your decorator
import { IUser } from '../interfaces/user.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/review.dto';

import { Public } from 'src/decorators/public.decorator';

@Controller('products') // Updated to match your API route prefix
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId/reviews')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @User() user: IUser, // Changed to use your decorator
  ) {
    return this.reviewsService.create(productId, createReviewDto, user);
  }

  @Public()
  @Get(':productId/reviews')
  findAllByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findAllByProduct(productId);
  }

  @Get(':productId/reviews/check')
  @UseGuards(JwtAuthGuard)
  async hasUserReviewedProduct(
    @Param('productId') productId: string,
    @User() user: IUser,
  ): Promise<{ hasReviewed: boolean }> {
    const hasReviewed = await this.reviewsService.hasUserReviewedProduct(
      user._id,
      productId,
    );
    return { hasReviewed };
  }
  
  @Delete('reviews/:reviewId')
  @UseGuards(JwtAuthGuard)
  deleteReview(
    @Param('reviewId') reviewId: string,
    @User() user: IUser, // Changed to use your decorator
  ) {
    return this.reviewsService.deleteReview(reviewId, user);
  }
}