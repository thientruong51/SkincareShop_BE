import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Gender {
  MEN = 'Men',
  WOMEN = 'Women',
  UNISEX = 'Unisex',
}

export type ProductDocument = HydratedDocument<Product>;


@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [{ type: String }] })
  suitableFor: string[]; // ['oily', 'dry', 'normal', 'combination']

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true, enum: Gender, default: Gender.UNISEX })
  gender: Gender;

  @Prop({ required: true })
  volume: string; // e.g., "100ml", "50g"

}

export const ProductSchema = SchemaFactory.createForClass(Product);
