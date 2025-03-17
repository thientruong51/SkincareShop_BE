import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blogs.schema';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogsModule {}
