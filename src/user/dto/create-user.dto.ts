import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Length of username needs to be at least 6 characters!',
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Length of password needs to be at least 6 characters!',
  })
  password: string;
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
