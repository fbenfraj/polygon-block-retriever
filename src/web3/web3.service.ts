import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service {
  public provider: ethers.JsonRpcProvider;

  constructor(private configService: ConfigService) {
    const alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');

    this.provider = new ethers.JsonRpcProvider(
      `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    );
  }

  async getBlockByNumber(blockNumber: number): Promise<ethers.Block> {
    return await this.provider.getBlock(blockNumber);
  }
}
