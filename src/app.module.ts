import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
