import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Option {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  score: number;
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ type: [Option], required: true })
  options: Option[];
}

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [Question], required: true })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
