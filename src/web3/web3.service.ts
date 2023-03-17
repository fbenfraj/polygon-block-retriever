import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { WebSocket } from 'ws';

@Injectable()
export class Web3Service {
  private readonly alchemyApiKey: string;
  public readonly webSocket: WebSocket;
  public provider: ethers.JsonRpcProvider;

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
      .on('message', (data) => {
        console.log('data: ', data);
      })
      .on('error', (error) => {
        console.log('error: ', error);
      })
      .on('close', (code, reason) => {
        console.log('close: ', code, reason);
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
}
