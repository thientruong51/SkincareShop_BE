// src/skintypes/skintypes.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkinType } from './schemas/skintypes.schema';
import { CreateSkinTypeDto } from './dto/create-skintype.dto';

@Injectable()
export class SkinTypesService {
  constructor(
    @InjectModel(SkinType.name) private skinTypeModel: Model<SkinType>,
  ) {}

  async create(createSkinTypeDto: CreateSkinTypeDto): Promise<SkinType> {
    try {
      // Chuyển đổi type thành lowercase để so sánh
      const normalizedType = createSkinTypeDto.type.toLowerCase().trim();
      
      // Kiểm tra có tồn tại skin type với tên tương tự (không phân biệt hoa thường)
      const existingSkinType = await this.skinTypeModel.findOne({
        type: { $regex: new RegExp('^' + normalizedType + '$', 'i') }
      }).exec();
      
      if (existingSkinType) {
        throw new BadRequestException(`Skin type "${createSkinTypeDto.type}" already exists`);
      }

      // Tạo skin type mới với dữ liệu đã được chuẩn hóa
      const createdSkinType = new this.skinTypeModel({
        ...createSkinTypeDto,
        type: createSkinTypeDto.type.trim() // Giữ nguyên cách viết hoa/thường của người dùng nhưng loại bỏ khoảng trắng
      });
      
      return await createdSkinType.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new BadRequestException(`Skin type "${createSkinTypeDto.type}" already exists in the database`);
      }
      console.error('Error creating skin type:', error);
      throw new BadRequestException('Error creating skin type: ' + error.message);
    }
  }

  async findAll(): Promise<SkinType[]> {
    return this.skinTypeModel.find().exec();
  }

  async findOne(id: string): Promise<SkinType> {
    const skinType = await this.skinTypeModel.findById(id).exec();
    if (!skinType) {
      throw new NotFoundException(`Skin type with ID ${id} not found`);
    }
    return skinType;
  }

  async update(id: string, skinTypeData: Partial<SkinType>): Promise<SkinType> {
    try {
      // Kiểm tra nếu có cập nhật trường type
      if (skinTypeData.type) {
        const normalizedType = skinTypeData.type.toLowerCase().trim();
        
        // Kiểm tra xem có skin type khác với ID khác có cùng tên không
        const existingSkinType = await this.skinTypeModel.findOne({
          _id: { $ne: id },
          type: { $regex: new RegExp('^' + normalizedType + '$', 'i') }
        }).exec();

        if (existingSkinType) {
          throw new BadRequestException(`Skin type "${skinTypeData.type}" already exists`);
        }

        // Chuẩn hóa dữ liệu type trước khi cập nhật
        skinTypeData.type = skinTypeData.type.trim();
      }

      const updatedSkinType = await this.skinTypeModel
        .findByIdAndUpdate(id, skinTypeData, { new: true })
        .exec();
      
      if (!updatedSkinType) {
        throw new NotFoundException(`Skin type with ID ${id} not found`);
      }
      
      return updatedSkinType;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new BadRequestException('This skin type name is already taken');
      }
      console.error('Error updating skin type:', error);
      throw new BadRequestException('Error updating skin type: ' + error.message);
    }
  }

  async delete(id: string): Promise<SkinType> {
    const deletedSkinType = await this.skinTypeModel.findByIdAndDelete(id).exec();
    if (!deletedSkinType) {
      throw new NotFoundException(`Skin type with ID ${id} not found`);
    }
    return deletedSkinType;
  }
}