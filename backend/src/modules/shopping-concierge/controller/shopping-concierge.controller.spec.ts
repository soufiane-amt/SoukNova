import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingConciergeController } from './shopping-concierge.controller';

describe('ShoppingConciergeController', () => {
  let controller: ShoppingConciergeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingConciergeController],
    }).compile();

    controller = module.get<ShoppingConciergeController>(ShoppingConciergeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
