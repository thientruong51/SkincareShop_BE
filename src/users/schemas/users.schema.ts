import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Order } from 'src/orders/schemas/orders.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop()
  refreshToken: string;

  @Prop({ enum: ['oily', 'combination', 'dry', 'normal'] })
  skinType: string;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop({ type: [{ type: String, ref: 'Order' }] })
  orderHistory: Order[];

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
