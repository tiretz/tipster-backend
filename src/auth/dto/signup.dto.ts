import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MAX_LENGTH,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Length of username needs to be at least 3 characters!',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Length of password needs to be at least 6 characters!',
  })
  password: string;
}
