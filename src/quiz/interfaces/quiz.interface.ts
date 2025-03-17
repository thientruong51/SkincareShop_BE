import { Document } from 'mongoose';

export interface IOption {
  text: string;
  score: number;
}

export interface IQuestion {
  text: string;
  weight: number;
  options: IOption[];
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  createdAt: Date;
  isActive: boolean;
}
