import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AtGuard } from './common/guards/at.guard';
import { AbilityModule } from './ability/ability.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, AbilityModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
