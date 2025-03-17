import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/products/schemas/products.schema';
import { Routine } from 'src/routines/schemas/routines.schema';

@Schema({ 
  timestamps: true,
  collection: 'skintypes',
  versionKey: false
})
export class SkinType {
  @Prop({ 
    required: true, 
    unique: true,
    type: String,
    trim: true
  })
  type: string;

  @Prop()
  description: string;

  @Prop([String])
  commonConcerns: string[];

  @Prop({ type: [{ type: String, ref: 'Product' }] })
  recommendedProducts: Product[];

  @Prop({ type: [{ type: String, ref: 'Routine' }] })
  recommendedRoutines: Routine[];

  @Prop()
  careTips: string;

  @Prop([String])
  dosList: string[];

  @Prop([String])
  dontsList: string[];
}

export const SkinTypeSchema = SchemaFactory.createForClass(SkinType);

// Create index for the type field
SkinTypeSchema.index({ type: 1 }, { unique: true });