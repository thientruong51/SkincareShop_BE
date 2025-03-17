import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';
import { MessageResponse } from 'src/decorators/message-response.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @MessageResponse('Create a new promotion')
  async create(@Body() createPromotionDto: CreatePromotionDTO) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @MessageResponse('Find all promotions')
  async findAll() {
    return this.promotionsService.findAll();
  }

  @Public()
  @Get('active')
  @MessageResponse('Find all active promotions')
  async findAllActive() {
    return this.promotionsService.findAllActive();
  }

  @Get(':id')
  @MessageResponse('Find a promotion by id')
  async findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  @MessageResponse('Update a promotion')
  async update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDTO,
  ) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}
