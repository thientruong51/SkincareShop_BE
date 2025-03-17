import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQ, FAQSchema } from './schemas/faqs.schema';
import { FaqsService } from './faqs.service';
import { FaqsController } from './faqs.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: FAQ.name, schema: FAQSchema }])],
  providers: [FaqsService],
  controllers: [FaqsController],
})
export class FaqsModule {}
