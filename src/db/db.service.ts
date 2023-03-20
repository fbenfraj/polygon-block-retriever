import { Injectable, Logger } from '@nestjs/common';
import { Block } from '../entities/block.entity';
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

  /**
   * Creates a new Block entity with the provided data and persists it to the database.
   *
   * @param hash - The hash of the block.
   * @param number - The block number in hex format.
   * @param parentHash - The hash of the parent block.
   * @param timestamp - The timestamp of the block in hex format.
   * @param forked - A boolean indicating whether the block is part of a fork.
   * @returns {Promise<Block>} The newly created and persisted Block entity.
   */
  async createBlock(
    hash: string,
    number: string,
    parentHash: string,
    timestamp: Date,
    forked: boolean,
  ): Promise<Block> {
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

  /**
   * Determines if a block with the given hash is a fork in the database.
   *
   * @param hash - The hash of the block to check.
   * @returns {Promise<boolean>} A Promise resolving to a boolean indicating whether the block is a fork.
   */
  async isAFork(hash: string): Promise<boolean> {
    const block = await this.emFork.findOne(Block, { hash });

    if (block) {
      return block.forked;
    }

    return false;
  }
}
