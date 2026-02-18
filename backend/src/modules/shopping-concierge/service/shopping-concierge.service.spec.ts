import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingConciergeService } from './shopping-concierge.service';

describe('ShoppingConciergeService', () => {
  let service: ShoppingConciergeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingConciergeService],
    }).compile();

    service = module.get<ShoppingConciergeService>(ShoppingConciergeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});