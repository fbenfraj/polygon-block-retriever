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

  /**
   * Retrieves a block by its number.
   * @param blockNumber - The number of the block to retrieve.
   * @returns A Promise resolving to the ethers.Block with the specified block number.
   */
  async getBlockByNumber(blockNumber: number): Promise<ethers.Block> {
    return await this.provider.getBlock(blockNumber);
  }
}
