import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Req() req: Request,
    @Body()
    body: {
      items: { productId: string; quantity: number; price: number }[];
      phoneNumber?: string;
      address?: string;
    },
    @Res() res: Response,
  ) {
   
    const userId = req.user['_id'];
    if (!userId) {
      return res
        .status(400)
        .json({ message: 'User ID is missing in token payload' });
    }
   
    const paymentUrl = await this.paymentsService.createPaymentUrl(
      userId,
      body.items,
      body.phoneNumber,
      body.address,
    );
    return res.json({ paymentUrl });
  }

  @Get('vnpay-return')
  @Public()
  async handleVnpayReturn(@Query() query: any, @Res() res: Response) {
    try {
      const result = await this.paymentsService.handlePaymentCallback(query);
      const frontendUrl = process.env.FRONTEND_URL;
      if (result.success && result.orderId) {
        return res.redirect(
          `${frontendUrl}/order-detail?orderId=${result.orderId}`
        );
      } else {
        return res.redirect(`${frontendUrl}`);
      }
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL;
      return res.redirect(`${frontendUrl}`);
    }
  }
}
