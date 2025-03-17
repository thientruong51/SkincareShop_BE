import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter your name.' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Please enter your email.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter your password.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter your role.' })
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin.' })
  role: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
 
  @IsString()
  @IsOptional()
  address?: string;
}
