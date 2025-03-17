import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interfaces/user.interface';
import { SignupDto } from './dtos/signup.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.getUser({ email });

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credentials are invalid');
      }

      return user;
      // eslint-disable-next-line
    } catch (error) {
      throw new UnauthorizedException('Credentials are invalid');
    }
  }

  // METHOD: helper function to create refresh token
  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    return refreshToken;
  };

  // METHOD: helper function to process new token
  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findOne({
        refreshToken: refresh_token,
      });

      if (user) {
        const { _id, email, name, role } = user;

        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          email,
          name,
          role,
        };

        const refresh_Token = this.createRefreshToken(payload);

        // NOTE: Update user with refresh token
        await this.usersService.updateUserToken(refresh_Token, _id.toString());

        // NOTE: set refresh token as cookies -- clear before set new one
        response.clearCookie('skincare-refresh-token');
        response.cookie('skincare-refresh-token', refresh_Token, {
          httpOnly: true,
          maxAge: ms(
            `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')}` as StringValue,
          ),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            email,
            name,
            role,
          },
        };
      } else {
        throw new BadRequestException('Invalid refresh token');
      }
      // eslint-disable-next-line
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  };

  // METHOD: Signup a user
  async signup(signupUser: SignupDto) {
    const user = await this.usersService.signup(signupUser);

    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }

  // METHOD: Login a user
  async login(user: IUser, response: Response) {
    const { _id, email, name, role } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      email,
      name,
      role,
    };

    const refresh_Token = this.createRefreshToken(payload);

    // NOTE: Update user with refresh token
    await this.usersService.updateUserToken(refresh_Token, _id.toString());

    // NOTE: set refresh token as cookies
    response.cookie('skincare-refresh-token', refresh_Token, {
      httpOnly: true,
      maxAge: ms(
        `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')}` as StringValue,
      ),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role,
      },
    };
  }

  // METHOD: Logout a user
  async logout(response: Response, userId: string) {
    await this.usersService.updateUserToken('', userId);

    response.clearCookie('skincare-refresh-token');

    return { message: 'Logout success' };
  }
}
