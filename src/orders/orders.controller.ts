import { Controller, Get, Param, Patch, Body, Delete, UseGuards, Req, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
  };
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  
  async getAllOrders() {
    return this.ordersService.findAll();
  }

  @Post('create')
  async createOrder(@Body() createOrderDto: any, @Req() req: AuthenticatedRequest) {
    try {
      const { userId, phoneNumber, address, items, totalAmount } = createOrderDto;
      if (!userId || !phoneNumber || !address || !items || !totalAmount) {
        return {
          success: false,
          message: "Thiếu thông tin bắt buộc",
        };
      }
      const orderData = {
        ...createOrderDto,
        status: "pending",
      };
      const order = await this.ordersService.create(orderData);
      return {
        success: true,
        data: order.toObject(), 
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Lỗi máy chủ",
      };
    }
  }



  @Get('totals')
  async getTotals() {
    return this.ordersService.getTotals();
  }

  @Get('my-orders')
  async getUserOrders(@Req() req: AuthenticatedRequest) { 
    const userId = req.user._id;
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id')
  
  async updateOrder(@Param('id') id: string, @Body() updateData: any) {
    return this.ordersService.update(id, updateData);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
  
}
