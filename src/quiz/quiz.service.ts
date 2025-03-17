import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
import { IQuiz, IQuestion } from './interfaces/quiz.interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>
  ) {}

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findOne(id: string): Promise<Quiz> {
    return this.quizModel.findById(id).exec();
  }

  async create(quizData: any): Promise<Quiz> {
    const createdQuiz = new this.quizModel(quizData);
    return createdQuiz.save();
  }

  async calculateSkinType(answers: { questionId: string, selectedOption: number }[]): Promise<string> {
    let totalScore = 0;
    let totalWeight = 0;

    for (const answer of answers) {
      const question = await this.findQuestionById(answer.questionId);
      if (!question) {
        throw new NotFoundException(`Question with id ${answer.questionId} not found`);
      }
      
      if (answer.selectedOption >= question.options.length) {
        throw new Error(`Invalid option selected for question ${answer.questionId}`);
      }

      totalScore += question.options[answer.selectedOption].score * question.weight;
      totalWeight += question.weight;
    }

    if (totalWeight === 0) {
      throw new Error('No valid questions found');
    }

    const finalScore = totalScore / totalWeight;
    return this.determineSkinType(finalScore);
  }

  private async findQuestionById(questionId: string): Promise<IQuestion | null> {
    const quiz = await this.quizModel.findOne({
      'questions._id': new Types.ObjectId(questionId)
    }).exec();
    
    if (!quiz) return null;
    const question = quiz.questions.find(q => q['_id'].toString() === questionId);
    return question ? {
      text: question.text,
      weight: question.weight,
      options: question.options
    } : null;
  }

  private determineSkinType(score: number): string {
    if (score <= 2) return 'Dry Skin';
    if (score <= 3) return 'Normal Skin';
    if (score <= 4) return 'Combination Skin';
    return 'Oily Skin';
  }
}
