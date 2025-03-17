import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payments.schema';
import { VnpayService } from 'nestjs-vnpay';
import { VnpLocale } from 'vnpay';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly vnpayService: VnpayService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 
   * @param userId
   * @param items
   * @param phoneNumber
   * @param address
   */
  async createPaymentUrl(
    userId: string,
    items: { productId: string; quantity: number; price: number }[],
    phoneNumber?: string,
    address?: string,
  ): Promise<string> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }


    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

 
    const payment: PaymentDocument = new this.paymentModel({
      userId,
      amount: totalAmount,
      items,
      status: 'pending',
      phoneNumber,
      address,
    });

  

    await payment.save();

  

  
    const paymentUrl = this.vnpayService.buildPaymentUrl({
      vnp_Amount: totalAmount,
      vnp_TxnRef: payment._id.toString(),
      vnp_OrderInfo: 'Thanh toán đơn hàng',
      vnp_OrderType: 'other',
      vnp_Locale: VnpLocale.VN,
      vnp_IpAddr: '127.0.0.1',
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    });

  

    return paymentUrl;
  }

  /**
   * 
   * @param query
   */
  async handlePaymentCallback(query: any): Promise<{ success: boolean; orderId?: string }> {
  

    const isValid = this.vnpayService.verifyReturnUrl(query);
    if (!isValid) {
      throw new BadRequestException('Giao dịch không hợp lệ');
    }

    const payment = await this.paymentModel.findById(query.vnp_TxnRef);
    if (!payment) {
      throw new BadRequestException('Không tìm thấy giao dịch');
    }

  

    payment.transactionId = query.vnp_TransactionNo;
    payment.status = query.vnp_ResponseCode === '00' ? 'completed' : 'failed';
    await payment.save();

   

    if (payment.status === 'completed') {
    
      const user = await this.usersService.getUser({ _id: payment.userId });


     
      const phoneNumber = user.phoneNumber || payment.phoneNumber;
      const address = user.address || payment.address;


     
      const order = await this.ordersService.create({
        userId: payment.userId,
        totalAmount: payment.amount,
        paymentId: String(payment._id),
        items: payment.items,
        status: 'confirmed',
        phoneNumber,
        address,
      });

   

      return { success: true, orderId: order._id.toString() };
    }

    return { success: false };
  }
}
