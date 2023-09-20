import { Exclude, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateCompetitionDto {
  @Exclude()
  id: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  info: string | undefined;
  @IsString()
  @IsNotEmpty()
  country: string;
  @IsDateString()
  @IsNotEmpty()
  date: Date;
  @IsBoolean()
  isOpen: boolean;
  @IsBoolean()
  isActive: boolean;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];
}
