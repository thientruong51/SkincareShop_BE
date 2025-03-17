import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SkinTypesService } from './skintypes.service';
import { CreateSkinTypeDto } from './dto/create-skintype.dto';
import { SkinType } from './schemas/skintypes.schema';

@Controller('skintypes')
export class SkinTypesController {
  constructor(private readonly skinTypesService: SkinTypesService) {}

  @Post()
  async create(@Body() createSkinTypeDto: CreateSkinTypeDto): Promise<SkinType> {
    try {
      return await this.skinTypesService.create(createSkinTypeDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error creating skin type',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll(): Promise<SkinType[]> {
    return this.skinTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SkinType> {
    return this.skinTypesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() skinTypeData: SkinType): Promise<SkinType> {
    try {
      return await this.skinTypesService.update(id, skinTypeData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error updating skin type',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<SkinType> {
    try {
      return await this.skinTypesService.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error deleting skin type',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}