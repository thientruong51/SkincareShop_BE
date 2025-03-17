import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateSkinTypeDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  commonConcerns: string[];

  @IsArray()
  @IsOptional()
  recommendedProducts: string[];

  @IsArray()
  @IsOptional()
  recommendedRoutines: string[];

  @IsString()
  @IsOptional()
  careTips: string;

  @IsArray()
  @IsOptional()
  dosList: string[];

  @IsArray()
  @IsOptional()
  dontsList: string[];
}
