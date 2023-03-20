import { Injectable, Logger } from '@nestjs/common';
import { Block } from 'src/entities/block.entity';
import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  AbstractSqlPlatform,
  EntityManager,
} from '@mikro-orm/postgresql';

@Injectable()
export class DbService {
  private readonly emFork: EntityManager<
    AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>
  >;
  private readonly logger = new Logger(DbService.name);

  constructor(private readonly em: EntityManager) {
    this.emFork = this.em.fork();
  }

  async createBlock(
    hash: string,
    number: string,
    parentHash: string,
    timestamp: Date,
    forked: boolean,
  ) {
    const unixTimestamp = parseInt(timestamp.toString(), 16);
    const timestampDate = new Date(unixTimestamp * 1000);

    const dto = {
      hash,
      number,
      parentHash,
      timestamp: timestampDate,
      forked,
    };
    const block = this.emFork.create(Block, dto);

    await this.emFork.persistAndFlush(block);

    this.logger.log(
      `Added to the database: ${block.hash} ${forked ? '(FORKED)' : ''}`,
    );

    return block;
  }
}
