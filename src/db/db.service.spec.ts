import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Block } from '../entities/block.entity';

const mockEntityManager = {
  fork: jest.fn().mockReturnThis(),
  create: jest.fn(),
  persistAndFlush: jest.fn(),
  findOne: jest.fn(),
};

describe('DbService', () => {
  let service: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DbService,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<DbService>(DbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if a block is a fork', async () => {
    const blockHash = '0x123';
    const block = new Block();
    block.forked = true;

    mockEntityManager.findOne.mockResolvedValueOnce(block);

    const isFork = await service.isAFork(blockHash);

    expect(mockEntityManager.findOne).toHaveBeenCalledWith(Block, {
      hash: blockHash,
    });
    expect(isFork).toBe(true);
  });

  it('should return false if a block is not found', async () => {
    const blockHash = '0x123';
    mockEntityManager.findOne.mockResolvedValueOnce(null);

    const isFork = await service.isAFork(blockHash);

    expect(mockEntityManager.findOne).toHaveBeenCalledWith(Block, {
      hash: blockHash,
    });
    expect(isFork).toBe(false);
  });
});
