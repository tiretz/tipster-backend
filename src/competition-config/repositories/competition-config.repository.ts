import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompetitionConfig } from '../entities/competition-config.entity';

export class CompetitionConfigRepository extends Repository<CompetitionConfig> {
  constructor(
    @InjectRepository(CompetitionConfig)
    private competitionRepository: Repository<CompetitionConfig>,
  ) {
    super(competitionRepository.target, competitionRepository.manager, competitionRepository.queryRunner);
  }
}
