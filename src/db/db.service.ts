import { Injectable } from '@nestjs/common';
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

  constructor(private readonly em: EntityManager) {
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

    console.log('Added to the database: ', block.hash);

    return block;
  }

  async findBlockById(id: number) {
    return await this.emFork.findOne(Block, { id });
  }
}
