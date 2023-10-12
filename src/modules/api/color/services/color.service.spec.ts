import { Test, TestingModule } from '@nestjs/testing';
import { ColorService } from './color.service';

describe('ColorService', () => {
  let colorService: ColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorService],
    }).compile();

    colorService = module.get<ColorService>(ColorService);
  });

  it('should be defined', () => {
    expect(colorService).toBeDefined();
  });
});
