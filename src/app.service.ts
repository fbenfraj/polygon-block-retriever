import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { DbService } from './db/db.service';
import { WebSocket } from 'ws';
import { Block } from './entities/block.entity';
import { Cache } from 'cache-manager';
import { WebsocketService } from './websocket/websocket.service';
import { Web3Service } from './web3/web3.service';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  private readonly webSocket: WebSocket;
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly webSocketService: WebsocketService,
    private readonly dbService: DbService,
    private readonly web3Service: Web3Service,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.webSocket = this.webSocketService.getWebSocket();
    this.webSocket.on('message', async (data) => {
      const dataString: string = data.toString();
      const jsonData = JSON.parse(dataString);

      if (jsonData.method === 'eth_subscription') {
        const block: Block = jsonData.params.result;
        const cachedBlock = await this.cacheManager.get(block.hash);

        if (cachedBlock) {
          this.logger.log(`Block already cached: ${block.hash}`);
          return;
        }

        await this.cacheManager.set(block.hash, 'pending');

        const parentHash = block.parentHash;
        const previousBlockNumber = parseInt(block.number, 16) - 1;
        const previousBlock: ethers.Block =
          await this.web3Service.getBlockByNumber(previousBlockNumber);
        const parentIsAFork = await this.dbService.isAFork(parentHash);
        const forked = parentHash !== previousBlock.hash || parentIsAFork;

        await this.dbService.createBlock(
          block.hash,
          block.number,
          block.parentHash,
          block.timestamp,
          forked,
        );
        await this.cacheManager.set(block.hash, 'done');
      }
    });
  }
}
