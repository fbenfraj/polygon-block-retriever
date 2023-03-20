import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if a block is cached', async () => {
    const blockHash = '0x123';
    mockCacheManager.get.mockResolvedValueOnce(null);

    const isCached = await service.isBlockCached(blockHash);
    expect(isCached).toBe(false);
    expect(mockCacheManager.get).toHaveBeenCalledWith(blockHash);
  });

  it('should set a cache value with TTL', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const ttl = 3600;

    await service.setCacheValue(key, value, ttl);
    expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, { ttl });
  });
});
