import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AtGuard } from './common/guards/at.guard';
import { AbilityModule } from './ability/ability.module';
import { CompetitionModule } from './competition/competition.module';
import { PoliciesGuard } from './common/guards/policy.guard';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: +configService.get<number>('DATABASE_PORT'),
          database: configService.get('DATABASE_NAME'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/migrations/*.js'],
          synchronize: true, // not recommended for production environment
        } as TypeOrmModuleAsyncOptions;
      },
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    AuthModule,
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
