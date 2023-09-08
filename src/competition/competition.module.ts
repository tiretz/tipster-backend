import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [AbilityModule],
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
