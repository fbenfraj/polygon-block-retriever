import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  private readonly alchemyApiKey: string;
  private readonly alchemyRpcUrl: string;
  public provider: ethers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    this.alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.alchemyRpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${this.alchemyApiKey}`;
  }

  async onModuleInit(): Promise<void> {
    this.provider = new ethers.JsonRpcProvider(this.alchemyRpcUrl);
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log('Connected to Polygon Mainnet');
      console.log('Current block number:', blockNumber);
    } catch (error) {
      console.error('Error connecting to Polygon Mainnet:', error);
    }
  }
}
