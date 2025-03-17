import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  NotFoundException 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';

import { Public } from 'src/decorators/public.decorator';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Put(':productId')
  async update(@Param('productId') productId: string, @Body() updateProductDto: Partial<CreateProductDto>) {
    const product = await this.productsService.update(productId, updateProductDto);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: string) {
    const product = await this.productsService.remove(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Put(':productId/restore')
  async restore(@Param('productId') productId: string) {
    const product = await this.productsService.restore(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
