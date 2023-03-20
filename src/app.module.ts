import { CacheModule as RedisModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { RedisClientOptions } from 'redis';
import { WebsocketModule } from './websocket/websocket.module';
import * as redisStore from 'cache-manager-redis-store';
import { WebsocketService } from './websocket/websocket.service';
import { Web3Module } from './web3/web3.module';
import { Web3Service } from './web3/web3.service';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.register<RedisClientOptions>({
      isGlobal: true,
      // ttl in milliseconds
      ttl: 300000,
      store: redisStore,
    }),
    MikroOrmModule.forRoot({
      type: 'postgresql',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      dbName: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: ['./dist/entities/*.js'],
      entitiesTs: ['./src/entities/*.ts'],
      autoLoadEntities: true,
    }),
    DbModule,
    WebsocketModule,
    Web3Module,
  ],
  providers: [
    AppService,
    DbService,
    WebsocketService,
    Web3Service,
    CacheService,
  ],
})
export class AppModule {}
