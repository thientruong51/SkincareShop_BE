import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateRoutineStepDto {
  @IsNumber()
  stepNumber: number;

  @IsString()
  stepName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  recommendedProduct: string;

  @IsString()
  @IsOptional()
  duration: string;
}

export class CreateRoutineDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  skinType: string;

  @IsArray()
  steps: CreateRoutineStepDto[];

  @IsString()
  @IsOptional()
  totalDuration: string;

  @IsString()
  @IsOptional()
  frequency: string;

  @IsString()
  @IsOptional()
  timeOfDay: string;

  @IsArray()
  @IsOptional()
  targetConcerns: string[];

  @IsString()
  @IsOptional()
  difficulty: string;
}
