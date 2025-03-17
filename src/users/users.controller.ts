import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MessageResponse } from 'src/decorators/message-response.decorator';
import { Public } from 'src/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/interfaces/user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthenticatedRequest extends Request {
  user: any; 
}
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @MessageResponse('Create a new user')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return req.user; 
  }
  
  @Get()
  @MessageResponse('Find all users')
  async findAll(
    @Query() query: { page: string; limit: string },
    @Query() queryString: string,
  ) {
    const { page, limit } = query;
    return this.usersService.findAll(+page, +limit, queryString);
  }

  @Public()
  @Get(':id')
  @MessageResponse('Find a user by id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne({ _id: id });
  }

  @Patch()
  @MessageResponse('Update a user')
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Patch('profile')
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch(':id/unban')
  @MessageResponse('Unban a user')
  async unban(@Param('id') id: string) {
    return this.usersService.unban(id);
  }

  @Delete(':id/ban')
  @MessageResponse('Ban a user')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
