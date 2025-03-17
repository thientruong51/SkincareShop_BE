// schemas/reviews.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Add compound index to ensure one review per user per product
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
