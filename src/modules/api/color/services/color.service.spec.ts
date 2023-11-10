import { Test, TestingModule } from '@nestjs/testing';
import { ColorService } from './color.service';
import { ColorRepository } from '../repositories/color.repository';
import { CoreModule } from 'src/modules/core/core.module';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { mockColorRepository } from '@test/mock/mock-color-repository';

describe('ColorService', () => {
  let colorService: ColorService;
  let colorRepository: ColorRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoreModule,
        CustomRepositoryModule.forCustomRepository([ColorRepository]),
      ],
      providers: [
        ColorService,
        // { provide: ColorRepository, useValue: mockColorRepository },
      ],
    }).compile();

    colorService = module.get<ColorService>(ColorService);
    colorRepository = module.get<ColorRepository>(ColorRepository);
  });

  it('ColorService와 ColorRepository가 정의되어 있어야 합니다.', () => {
    expect(colorService).toBeDefined();
    expect(colorRepository).toBeDefined();
  });

  // describe('ColorService - findColorList', () => {
  //   it('asdf', async () => {
  //     expect(colorRepository.find).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('ColorService - findOneById', () => {
  //   it('aaa', async () => {
  //     const mockColorEntity = new ColorEntity();
  //     mockColorEntity.id = 1;
  //     mockColorEntity.name = 'Red';
  //     mockColorEntity.code = '#FFA1A1';

  //     jest.spyOn(colorRepository, 'findOne').mockResolvedValue(mockColorEntity);

  //     const result = await colorService.findOneById(1);
  //     expect(result).toEqual(ColorDto.ofByValue(mockColorEntity));
  //   });
  // });

  afterAll(async () => {
    await module.close();
  });
});
