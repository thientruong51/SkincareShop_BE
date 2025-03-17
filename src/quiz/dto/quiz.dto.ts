import { IsArray, IsString, ValidateNested, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsNumber()
  @IsNotEmpty()
  selectedOption: number;
}

export class QuizSubmitDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
