import { IsString, IsNumber, IsArray, IsEnum, IsNotEmpty, Min, IsOptional } from 'class-validator';
import {  Gender } from '../schemas/products.schema';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  suitableFor: string[];

  @IsNumber()
  @Min(0)
  averageRating: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  volume: string;

}