import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Routine } from './schemas/routines.schema';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectModel(Routine.name) private routineModel: Model<Routine>,
  ) {}

  async create(routineData: any): Promise<Routine> {
    const createdRoutine = new this.routineModel(routineData);
    return createdRoutine.save();
  }

  async findAll(): Promise<Routine[]> {
    return this.routineModel
      .find()
      .populate('skinType', 'type description')
      .exec();
  }

  async findOne(id: string): Promise<Routine> {
    return this.routineModel
      .findById(id)
      .populate('skinType', 'type description')
      .exec();
  }

  async findBySkinType(skinType: string): Promise<Routine[]> {
    return this.routineModel.find({ skinType }).exec();
  }

  async findBySkinTypeId(skinTypeId: string): Promise<Routine[]> {
    const objectId = new Types.ObjectId(skinTypeId);
    return this.routineModel
      .find({ skinType: objectId })
      .populate('skinType', 'type description')
      .exec();
  }

  async update(id: string, routineData: any): Promise<Routine> {
    return this.routineModel
      .findByIdAndUpdate(id, routineData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Routine> {
    return this.routineModel.findByIdAndDelete(id).exec();
  }
}