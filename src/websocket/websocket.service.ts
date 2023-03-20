import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSocket } from 'ws';

@Injectable()
export class WebsocketService {
  public readonly webSocket: WebSocket;
  private readonly logger = new Logger(WebsocketService.name);

  constructor(private configService: ConfigService) {
    const alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    
    this.webSocket = new WebSocket(
      `wss://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
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
