import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';
import { Web3Service } from './web3/web3.service';
import { WebSocket } from 'ws';
import { Block } from './entities/block.entity';

@Injectable()
export class AppService {
  private readonly webSocket: WebSocket;

  constructor(
    private readonly web3Service: Web3Service,
    private readonly dbService: DbService,
  ) {
    this.webSocket = this.web3Service.getWebSocket();
    this.webSocket.on('message', (data) => {
      const dataString: string = data.toString();
      const jsonData = JSON.parse(dataString);

      if (jsonData.method === 'eth_subscription') {
        const block: Block = jsonData.params.result;
        this.dbService.createBlock(
          block.hash,
          block.parentHash,
          block.timestamp,
        );
      }
    });
  }
}
