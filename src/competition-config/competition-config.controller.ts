import { Controller, Get, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { CompetitionConfigService } from './competition-config.service';
import { UpdateCompetitionConfigDto } from './dto/update-competition-config.dto';
import { CheckPolicies } from 'src/common/decorators/policy.decorator';
import { AppAbility } from 'src/ability/types/appability.type';
import { Action } from 'src/ability/enums/action.enum';
import { CompetitionConfig } from './entities/competition-config.entity';

@Controller('competitions/:id/config')
export class CompetitionConfigController {
  constructor(private readonly competitionConfigService: CompetitionConfigService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CompetitionConfig))
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CompetitionConfig> {
    return this.competitionConfigService.findOne(id);
  }

  @Patch()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CompetitionConfig))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetitionConfigDto: UpdateCompetitionConfigDto,
  ): Promise<CompetitionConfig> {
    return this.competitionConfigService.update(id, updateCompetitionConfigDto);
  }
}
