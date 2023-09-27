import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompetitionConfigDto } from './dto/update-competition-config.dto';
import { CompetitionConfig } from './entities/competition-config.entity';
import { CompetitionConfigRepository } from './repositories/competition-config.repository';

@Injectable()
export class CompetitionConfigService {
  constructor(private competitionConfigRepository: CompetitionConfigRepository) {}

  async findOne(id: number): Promise<CompetitionConfig> {
    const competitionConfig = await this.competitionConfigRepository.findOne({
      where: { competition: { id } },
    });

    if (!competitionConfig) throw new NotFoundException(`Config of competition with id ${id} not found`);

    return competitionConfig;
  }

  async update(id: number, updateCompetitionConfigDto: UpdateCompetitionConfigDto): Promise<CompetitionConfig> {
    const competitionConfig = await this.competitionConfigRepository.findOne({
      where: { competition: { id } },
    });

    if (!competitionConfig) throw new NotFoundException(`Config of competition with id ${id} not found`);

    competitionConfig.correctDifferencePoints = updateCompetitionConfigDto.correctDifferencePoints ?? undefined;
    competitionConfig.correctTendencyPoints = updateCompetitionConfigDto.correctTendencyPoints ?? undefined;
    competitionConfig.exactTipPoints = updateCompetitionConfigDto.exactTipPoints ?? undefined;
    competitionConfig.finalOpponentsActive = updateCompetitionConfigDto.finalOpponentsActive ?? undefined;
    competitionConfig.finalOpponentsPoints = updateCompetitionConfigDto.finalOpponentsPoints ?? undefined;
    competitionConfig.finalRankingOrder = updateCompetitionConfigDto.finalRankingOrder ?? undefined;
    competitionConfig.finalWinnerActive = updateCompetitionConfigDto.finalWinnerActive ?? undefined;
    competitionConfig.finalWinnerPoints = updateCompetitionConfigDto.finalWinnerPoints ?? undefined;
    competitionConfig.scoring = updateCompetitionConfigDto.scoring ?? undefined;
    competitionConfig.totalNumberOfGoalsActive = updateCompetitionConfigDto.totalNumberOfGoalsActive ?? undefined;
    competitionConfig.totalNumberOfGoalsPoints = updateCompetitionConfigDto.totalNumberOfGoalsPoints ?? undefined;

    return competitionConfig.save();
  }
}
