import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CreatePromotionDTO {
  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsNumber()
  discountPercentage: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsBoolean()
  isActive: boolean;
}

