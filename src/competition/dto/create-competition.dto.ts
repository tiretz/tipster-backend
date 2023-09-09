import { Competition as CompetitionType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCompetitionDto implements CompetitionType {
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
  isActive: boolean;
}
