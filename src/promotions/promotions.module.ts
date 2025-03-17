import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './schemas/promotions.schema';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
    ]),
  ],
  providers: [PromotionsService],
  controllers: [PromotionsController],
  exports: [PromotionsService],
})
export class PromotionsModule {}