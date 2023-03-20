import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import { ConfigService } from '@nestjs/config';

describe('Web3Service', () => {
  let service: Web3Service;
  let configService: ConfigService;

  beforeEach(async () => {
    const configServiceMock = {
      get: jest.fn().mockReturnValue('test_alchemy_api_key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Web3Service,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<Web3Service>(Web3Service);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get block by number', async () => {
    const blockNumber = 123;
    const blockMock = {
      number: blockNumber,
      hash: '0x123',
    };

    jest
      .spyOn(service.provider, 'getBlock')
      .mockResolvedValue(blockMock as any);

    const block = await service.getBlockByNumber(blockNumber);

    expect(block).toEqual(blockMock);
    expect(service.provider.getBlock).toHaveBeenCalledWith(blockNumber);
  });
});
