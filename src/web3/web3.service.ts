import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { WebSocket } from 'ws';

@Injectable()
export class Web3Service {
  private readonly alchemyApiKey: string;
  public readonly webSocket: WebSocket;
  public provider: ethers.JsonRpcProvider;
  private readonly logger = new Logger(Web3Service.name);

  constructor(private configService: ConfigService) {
    this.alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.provider = new ethers.JsonRpcProvider(
      `https://polygon-mainnet.g.alchemy.com/v2/${this.alchemyApiKey}`,
    );
    this.webSocket = new WebSocket(
      `wss://polygon-mainnet.g.alchemy.com/v2/${this.alchemyApiKey}`,
    )
      .on('open', () => {
        this.subscribeToNewHeads();
      })
      .on('error', (error) => {
        this.logger.error('Error: ', error);
      })
      .on('close', (code, reason) => {
        this.logger.error('Close: ', code, reason);
      });
  }

  private subscribeToNewHeads() {
    const payload = {
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_subscribe',
      params: ['newHeads'],
    };

    this.webSocket.send(JSON.stringify(payload));
  }

  public getWebSocket(): WebSocket {
    return this.webSocket;
  }
}
