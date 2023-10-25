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

  describe('findColorList', () => {
    it('color 변수는 ~다', async () => {
      // const colors = await ColorEntity.findColorList();
      const result = await colorService.findColorList();
    });
  });
});
