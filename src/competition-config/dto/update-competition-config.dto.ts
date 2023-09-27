import { PartialType } from '@nestjs/mapped-types';
import { CreateCompetitionConfigDto } from './create-competition-config.dto';

export class UpdateCompetitionConfigDto extends PartialType(CreateCompetitionConfigDto) {}
