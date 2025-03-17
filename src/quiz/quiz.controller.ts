import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizSubmitDto } from './dto/quiz.dto';
import { IQuiz } from './interfaces/quiz.interface';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getAllQuizzes() {
    try {
      const quizzes = await this.quizService.findAll();
      if (!quizzes || quizzes.length === 0) {
        throw new HttpException('No quizzes found', HttpStatus.NOT_FOUND);
      }
      return quizzes;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching quizzes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getQuiz(@Param('id') id: string) {
    return await this.quizService.findOne(id);
  }

  @Post('submit')
  @UsePipes(new ValidationPipe())
  async submitQuiz(@Body() quizSubmitDto: QuizSubmitDto) {
    try {
      if (!quizSubmitDto.answers || !Array.isArray(quizSubmitDto.answers)) {
        throw new HttpException('Invalid answers format', HttpStatus.BAD_REQUEST);
      }
      return await this.quizService.calculateSkinType(quizSubmitDto.answers);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error processing quiz submission',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createQuiz(@Body() quizData: Partial<IQuiz>) {
    return await this.quizService.create(quizData);
  }
}
