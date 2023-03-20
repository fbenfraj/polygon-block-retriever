import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db/db.service';
import { RawData, WebSocket } from 'ws';
import { Block } from './entities/block.entity';
import { WebsocketService } from './websocket/websocket.service';
import { Web3Service } from './web3/web3.service';
import { CacheService } from './cache/cache.service';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  private readonly webSocket: WebSocket;
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly webSocketService: WebsocketService,
    private readonly dbService: DbService,
    private readonly web3Service: Web3Service,
    private readonly cacheService: CacheService,
  ) {
    this.webSocket = this.webSocketService.getWebSocket();
    this.webSocket.on('message', (data) => this.handleMessage(data));
  }

  /**
   * Handles incoming WebSocket messages, checks for Ethereum block data,
   * and processes the block if it is a new one.
   *
   * @param {WebSocket.Data} data - The raw data received from the WebSocket.
   * @returns {Promise<void>}
   */
  async handleMessage(data: RawData): Promise<void> {
    const dataString: string = data.toString();
    const jsonData = JSON.parse(dataString);

    if (jsonData.method === 'eth_subscription') {
      const block: Block = jsonData.params.result;
      const cachedBlock = await this.cacheService.isBlockCached(block.hash);

      if (cachedBlock) {
        this.logger.log(`Block already cached: ${block.hash}`);
        return;
      }

      await this.processBlock(block);
    }
  }

  /**
   * Processes an Ethereum block by checking if it is a fork or a part of the main chain,
   * saves it to the database, and updates the cache.
   *
   * @param {Block} block - The Ethereum block to process.
   * @returns {Promise<void>}
   */
  async processBlock(block: Block): Promise<void> {
    await this.cacheService.setCacheValue(block.hash, 'pending');

    const parentHash = block.parentHash;
    const previousBlockNumber = parseInt(block.number, 16) - 1;
    const previousBlock: ethers.Block = await this.web3Service.getBlockByNumber(
      previousBlockNumber,
    );
    const parentIsAFork = await this.dbService.isAFork(parentHash);
    const forked = parentHash !== previousBlock.hash || parentIsAFork;

    await this.dbService.createBlock(
      block.hash,
      block.number,
      block.parentHash,
      block.timestamp,
      forked,
    );
    await this.cacheService.setCacheValue(block.hash, 'done');
  }
}
