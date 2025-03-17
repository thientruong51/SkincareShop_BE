import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FAQ {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);
