import { Module } from '@nestjs/common';
import { CompetitionActionService } from './competition-action.service';
import { CompetitionActionController } from './competition-action.controller';
import { CompetitionModule } from 'src/competition/competition.module';
import { UserModule } from 'src/user/user.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [AbilityModule, CompetitionModule, UserModule],
  controllers: [CompetitionActionController],
  providers: [CompetitionActionService],
})
export class CompetitionActionModule {}
