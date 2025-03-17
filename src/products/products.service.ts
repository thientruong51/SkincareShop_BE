import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/products.schema';
import { CreateProductDto } from './dto/create-products.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: SoftDeleteModel<ProductDocument>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productData: Product = {
      name: createProductDto.name,
      description: createProductDto.description || '',
      imageUrl: createProductDto.imageUrl || '',
      price: createProductDto.price,
      suitableFor: createProductDto.suitableFor || [],
      averageRating: createProductDto.averageRating || 0,
      stock: createProductDto.stock || 0,
      gender: createProductDto.gender,
      volume: createProductDto.volume,
    };
    
    const newProduct = new this.productModel(productData);
    return newProduct.save();
  }

  async update(productId: string, updateDto: Partial<CreateProductDto>): Promise<Product> {
    const existingProduct = await this.productModel.findById(productId).exec();
    
    if (!existingProduct) {
      return null;
    }
    
    // Apply updates while maintaining required fields
    if (updateDto.name) existingProduct.name = updateDto.name;
    if (updateDto.description !== undefined) existingProduct.description = updateDto.description;
    if (updateDto.imageUrl !== undefined) existingProduct.imageUrl = updateDto.imageUrl;
    if (updateDto.price !== undefined) existingProduct.price = updateDto.price;
    if (updateDto.suitableFor) existingProduct.suitableFor = updateDto.suitableFor;
    if (updateDto.averageRating !== undefined) existingProduct.averageRating = updateDto.averageRating;
    if (updateDto.stock !== undefined) existingProduct.stock = updateDto.stock;
    if (updateDto.gender !== undefined) existingProduct.gender = updateDto.gender;
    if (updateDto.volume !== undefined) existingProduct.volume = updateDto.volume;
    
    return existingProduct.save();
  }
  
  async remove(productId: string): Promise<Product | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product id');
    }
    
    const result = await this.productModel.softDelete({
      _id: productId,
    });
  
    if (result.deleted === 0) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  
    return this.productModel.findById(productId);
  }
  
  async restore(productId: string): Promise<Product | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product id');
    }
  
    const result = await this.productModel.restore({
      _id: productId,
    });
  
    if (result.restored === 0) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  
    return this.productModel.findById(productId);
  }
  
  // New method to update product rating
  async updateRating(productId: string, averageRating: number): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { averageRating: averageRating },
      { new: true }
    ).exec();
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    
    return product;
  }

  async findAll(query: any): Promise<Product[]> {
    return this.productModel.find(query).exec();
  }

  async findOne(productId: string): Promise<Product> {
    return this.productModel.findById(productId).exec();
  }
}
