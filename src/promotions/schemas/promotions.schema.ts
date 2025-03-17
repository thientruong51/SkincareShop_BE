import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PromotionDocument = HydratedDocument<Promotion>;
@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  code: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  discountPercentage: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);