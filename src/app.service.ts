import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { DbService } from './db/db.service';
import { WebSocket } from 'ws';
import { Block } from './entities/block.entity';
import { Cache } from 'cache-manager';
import { WebsocketService } from './websocket/websocket.service';

@Injectable()
export class AppService {
  private readonly webSocket: WebSocket;
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly webSocketService: WebsocketService,
    private readonly dbService: DbService,
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

        await this.dbService.createBlock(
          block.hash,
          block.parentHash,
          block.timestamp,
        );

        await this.cacheManager.set(block.hash, 'done');
      }
    });
  }
}
