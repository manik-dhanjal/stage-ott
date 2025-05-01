import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyListModule } from './my-list/my-list.module';
import { TVShowModule } from './tv-show/tv-show.module';
import { MovieModule } from './movie/movie.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DATABASE_CONFIG_NAME,
  DatabaseConfig,
  databaseConfig,
} from './shared/config/database.config';
import { userConfig } from './shared/config/user.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@shared/gaurd/auth.gaurd';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { REDIS_CONFIG_NAME, RedisConfig } from '@config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, userConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get<DatabaseConfig>(
          DATABASE_CONFIG_NAME,
        ) as DatabaseConfig,
      inject: [ConfigService],
    }),
    MovieModule,
    TVShowModule,
    MyListModule,
    UserModule,
    CacheModule.register({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>(REDIS_CONFIG_NAME);
        const store = await redisStore({
          socket: {
           ...redisConfig
          },
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
    provide: APP_GUARD,
    useClass: AuthGuard,
    }
  ],
})
export class AppModule {}
