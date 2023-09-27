import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { CheckPolicies } from 'src/common/decorators/policy.decorator';
import { Competition } from './entities/competition.entity';
import { AppAbility } from 'src/ability/types/appability.type';
import { Action } from 'src/ability/enums/action.enum';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Competition))
  async create(@Body() createCompetitionDto: CreateCompetitionDto): Promise<Competition> {
    return this.competitionService.create(createCompetitionDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async findAll(): Promise<Competition[]> {
    return this.competitionService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Competition))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Competition> {
    return this.competitionService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Competition))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ): Promise<Competition> {
    return this.competitionService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Competition))
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Competition> {
    return this.competitionService.delete(id);
  }
}
