import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({
    type: [{ productId: String, quantity: Number, price: Number }],
    required: true,
  })
  items: { productId: string; quantity: number; price: number }[];

  @Prop({ required: true })
  amount: number;

  @Prop()
  transactionId?: string; 

  @Prop({ default: 'VNPAY' })
  paymentMethod: string;

  @Prop({ enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: string;
  
  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
