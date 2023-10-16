import { Test, TestingModule } from '@nestjs/testing';
import { ColorController } from './color.controller';
import { ColorService } from '../services/color.service';
import { CustomCacheModule } from 'src/modules/core/custom-cache/custom-cache.module';

describe('ColorController', () => {
  let colorController: ColorController;
  let colorService: ColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CustomCacheModule],
      controllers: [ColorController],
      providers: [ColorService],
    }).compile();

    colorController = module.get<ColorController>(ColorController);
    colorService = module.get<ColorService>(ColorService);
  });

  it('ColorController가 정의되어 있어야 합니다.', () => {
    expect(colorController).toBeDefined();
  });
});
