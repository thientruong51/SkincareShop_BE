import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/products/schemas/products.schema';
import * as mongoose from 'mongoose';
import { SkinType } from 'src/skintypes/schemas/skintypes.schema';

@Schema()
export class RoutineStep {
  @Prop({ required: true })
  stepNumber: number;

  @Prop({ required: true })
  stepName: string;

  @Prop()
  description: string;

  @Prop({ type: String, ref: 'Product' })
  recommendedProduct: Product;

  @Prop()
  duration: string;
}

@Schema()
export class Routine {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'SkinType' })
  skinType: SkinType;

  @Prop([RoutineStep])
  steps: RoutineStep[];

  @Prop()
  totalDuration: string;

  @Prop()
  frequency: string;

  @Prop()
  timeOfDay: string; // 'Morning' | 'Evening' | 'Both'

  @Prop([String])
  targetConcerns: string[];

  @Prop()
  difficulty: string; // 'Beginner' | 'Intermediate' | 'Advanced'
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);