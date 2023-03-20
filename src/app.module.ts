import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Web3Module } from './web3/web3.module';
import { Web3Service } from './web3/web3.service';
import { DbModule } from './db/db.module';
import { DbService } from './db/db.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
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
    Web3Module,
    DbModule,
  ],
  providers: [AppService, DbService, Web3Service],
})
export class AppModule {}
