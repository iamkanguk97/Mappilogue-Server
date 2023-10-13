import { Test, TestingModule } from '@nestjs/testing';
import { ColorController } from './color.controller';
import { ColorService } from '../services/color.service';
import { ColorEntity } from '../entities/color.entity';
import { ColorDto } from '../dtos/color.dto';
import { CustomConfigService } from 'src/modules/core/custom-config/services';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { ConfigService } from '@nestjs/config';
import { CustomCacheModule } from 'src/modules/core/custom-cache/custom-cache.module';
import { CoreModule } from 'src/modules/core/core.module';

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

  // describe('colorList', () => {
  //   let colors;

  //   beforeEach(async () => {
  //     colors = (await ColorEntity.findColorList()).map(ColorDto.fromEntity);
  //   });

  //   it('제공하고 있는 색깔 옵션들을 반환해야 합니다.', () => {
  //     jest.spyOn(colorService, 'findColorList').mockReturnValue(colors);
  //     expect(colorService.findColorList).toBeCalledTimes(1);
  //     expect(colorService.findColorList).toBe(colors);
  //   });
  // });
});
