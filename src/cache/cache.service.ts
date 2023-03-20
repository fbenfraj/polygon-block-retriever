import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async isBlockCached(blockHash: string): Promise<boolean> {
    const cachedBlock = await this.cacheManager.get(blockHash);
    return cachedBlock !== undefined && cachedBlock !== null;
  }

  // Add this function
  async setCacheValue(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.cacheManager.set(key, value, { ttl });
    } else {
      await this.cacheManager.set(key, value);
    }
  }
}
