import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
