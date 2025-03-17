import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import mongoose, { FilterQuery } from 'mongoose';
import { hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import aqp from 'api-query-params';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { isMongoId } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  async signup(signupUser: SignupDto) {
    // CHECK EMAIL
    const userExists = await this.userModel.findOne({
      email: signupUser.email,
    });

    if (userExists) {
      throw new BadRequestException(`Email ${signupUser.email} already exists`);
    }

    const hashedPassword = hashSync(signupUser.password, 10);

    // NOTE: we do not need to add role here because it is already set default to 'user' in the schema
    const newUser = await this.userModel.create({
      ...signupUser,
      password: hashedPassword,
    });

    return newUser;
  }

  async create(createUserDto: CreateUserDto) {
    // CHECK EMAIL
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new BadRequestException(
        `Email ${createUserDto.email} already exists`,
      );
    }

    const hashedPassword = hashSync(createUserDto.password, 10);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return {
      _id: newUser._id,
      createdAt: newUser.createdAt,
    };
  }

  // EXAMPLE: for filter -- "/companies?page=1&limit=10&name=/ow/i"
  // -- the /ow/ is a regex -- which will check if the name contains "ow"
  // -- the /i/ is a flag -- which will make the regex case-insensitive
  async findAll(page: number, limit: number, queryString: string) {
    const { filter, population } = aqp(queryString);
    const { sort } = aqp(queryString);
    delete filter.page; // delete this .page because we already have page from the function argument

    const offset = (page - 1) * limit;
    const defaultLimit = limit ? limit : 10;
    const currentDocumentInPage = defaultLimit;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    /* if (isEmpty(sort)) {
      sort.updatedAt = -1;
    } */

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select('-password -__v');

    return {
      meta: {
        current: page, // trang hiện tại
        pageSize: defaultLimit, // số lượng item trên 1 trang
        currentDocumentInPage, // số lượng item trên trang hiện tại
        pages: totalPages, // tổng số trang
        total: totalItems, // tổng số item
      },
      result,
    };
  }

  async findOne(query: FilterQuery<User>): Promise<UserDocument | null> {
    if (query._id && !mongoose.Types.ObjectId.isValid(query._id)) {
      throw new BadRequestException('Invalid id');
    }

    return this.userModel.findOne(query).select('-password -__v');
  }

  async getUser(query: FilterQuery<User>): Promise<User | null> {
    const user = await this.userModel.findOne(query);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, ...updateData } = updateUserDto;

    return await this.userModel
      .findByIdAndUpdate(
        _id,
        {
          ...updateData,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select('-password -__v');
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateProfileDto,
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async updateUserToken(refreshToken: string, _id: string) {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    return this.userModel.softDelete({
      _id: id,
    });
  }

  async unban(id: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException('Invalid id');
    }

    return this.userModel.restore({
      _id: id,
    });
  }
}
