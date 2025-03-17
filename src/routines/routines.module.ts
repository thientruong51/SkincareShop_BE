import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Routine, RoutineSchema } from './schemas/routines.schema';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Routine.name, schema: RoutineSchema }]),
  ],
  providers: [RoutinesService],
  controllers: [RoutinesController],
})
export class RoutinesModule {}