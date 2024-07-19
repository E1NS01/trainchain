import { Test, TestingModule } from '@nestjs/testing';
import { BlockStorageService } from './block-storage.service';

describe('BlockStorageService', () => {
  let service: BlockStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockStorageService],
    }).compile();

    service = module.get<BlockStorageService>(BlockStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
