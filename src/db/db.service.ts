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

  constructor(
    private readonly em: EntityManager,
    private readonly logger = new Logger(DbService.name),
  ) {
    this.emFork = this.em.fork();
  }

  async createBlock(
    hash: string,
    parentHash: string,
    timestamp: string,
    forked: boolean = false,
  ) {
    const dto = {
      hash,
      parentHash,
      timestamp,
      forked,
    };
    const block = this.emFork.create(Block, dto);

    await this.emFork.persistAndFlush(block);

    this.logger.log('Added to the database: ', block.hash);

    return block;
  }

  async findBlockById(id: number) {
    return await this.emFork.findOne(Block, { id });
  }
}
