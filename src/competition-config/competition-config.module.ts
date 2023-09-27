import { Module } from '@nestjs/common';
import { CompetitionConfigService } from './competition-config.service';
import { CompetitionConfigController } from './competition-config.controller';
import { CompetitionConfig } from './entities/competition-config.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionConfigRepository } from './repositories/competition-config.repository';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitionConfig]), AbilityModule],
  controllers: [CompetitionConfigController],
  providers: [CompetitionConfigService, CompetitionConfigRepository],
  exports: [CompetitionConfigModule, CompetitionConfigRepository],
})
export class CompetitionConfigModule {}
