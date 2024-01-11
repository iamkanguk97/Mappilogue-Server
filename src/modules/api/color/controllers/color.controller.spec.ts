import { Test, TestingModule } from '@nestjs/testing';
import { ColorController } from './color.controller';
import { ColorService } from '../services/color.service';
import { ColorRepository } from '../repositories/color.repository';
import { CoreModule } from 'src/modules/core/core.module';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';

describe('ColorController', () => {
  let colorController: ColorController;
  let colorService: ColorService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoreModule,
        CustomRepositoryModule.forCustomRepository([ColorRepository]),
      ],
      controllers: [ColorController],
      providers: [ColorService],
    }).compile();

    colorController = module.get<ColorController>(ColorController);
    colorService = module.get<ColorService>(ColorService);
  });

  it('ColorController와 ColorService가 정의되어 있어야 합니다.', () => {
    expect(colorController).toBeDefined();
    expect(colorService).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
  });
});
