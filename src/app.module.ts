import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { FaqsModule } from './faqs/faqs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.module';
import { RoutinesModule } from './routines/routines.module';
import { PaymentsModule } from './payments/payments.module';
import { SkinTypesModule } from './skintypes/skintypes.module';  // Changed from SkintypesModule
import { PromotionsModule } from './promotions/promotions.module';
import { QuizModule } from './quiz/quiz.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        dbName: 'skincare-sale',
        // NOTE: softDeletePlugin is a plugin that we created to handle soft delete functionality in MongoDB with deleteAt and isDeleted fields
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PaymentsModule,
    ProductsModule,
    SkinTypesModule,
    RoutinesModule,
    OrdersModule,
    PromotionsModule,
    ReviewsModule,
    BlogsModule,
    FaqsModule,
    AuthModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
