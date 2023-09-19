import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competition } from '../entities/competition.entity';

export class CompetitionRepository extends Repository<Competition> {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,
  ) {
    super(
      competitionRepository.target,
      competitionRepository.manager,
      competitionRepository.queryRunner,
    );
  }
}
