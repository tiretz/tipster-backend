import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { AbilityModule } from 'src/ability/ability.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './entities/competition.entity';
import { CompetitionRepository } from './repositories/competition.repository';
import { UserModule } from 'src/user/user.module';
import { CompetitionConfigModule } from 'src/competition-config/competition-config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Competition]), AbilityModule, UserModule, CompetitionConfigModule],
  controllers: [CompetitionController],
  providers: [CompetitionService, CompetitionRepository],
  exports: [CompetitionModule, CompetitionService],
})
export class CompetitionModule {}
