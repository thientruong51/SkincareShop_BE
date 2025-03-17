import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from 'src/products/schemas/products.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
      },
    ],
    required: true,
  })
  items: { productId: string | Product; quantity: number; price: number }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({  ref: 'Payment' }) 
  paymentId: string;

  @Prop({
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;
  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
