import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AtGuard } from './common/guards/at.guard';
import { AbilityModule } from './ability/ability.module';
import { CompetitionModule } from './competition/competition.module';
import { PoliciesGuard } from './common/guards/policy.guard';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    AbilityModule,
    CompetitionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
})
export class AppModule {}
