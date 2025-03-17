import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkinTypesController } from './skintypes.controller';
import { SkinTypesService } from './skintypes.service';
import { SkinType, SkinTypeSchema } from './schemas/skintypes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SkinType.name, schema: SkinTypeSchema }])
  ],
  controllers: [SkinTypesController],
  providers: [SkinTypesService],
})
export class SkinTypesModule {}