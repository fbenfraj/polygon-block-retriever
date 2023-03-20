import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Checks if a block is cached.
   * @param blockHash - The hash of the block to check.
   * @returns A Promise resolving to a boolean indicating whether the block is cached.
   */
  async isBlockCached(blockHash: string): Promise<boolean> {
    const cachedBlock = await this.cacheManager.get(blockHash);
    return cachedBlock !== undefined && cachedBlock !== null;
  }

  /**
   * Sets a cache value for the given key.
   * @param key - The key to store the value.
   * @param value - The value to store.
   * @param ttl - Optional time-to-live for the cache entry, in seconds.
   * @returns A Promise resolving when the cache entry is set.
   */
  async setCacheValue(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.cacheManager.set(key, value, { ttl });
    } else {
      await this.cacheManager.set(key, value);
    }
  }
}
