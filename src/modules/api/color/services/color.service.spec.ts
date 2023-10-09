import { Test, TestingModule } from '@nestjs/testing';
import { ColorRepository } from '../repositories/color.repository';
import { ColorService } from './color.service';

describe('ColorService', () => {
  let colorService: ColorService;
  let colorRepository: ColorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorService, ColorRepository],
    }).compile();

    colorService = module.get<ColorService>(ColorService);
    colorRepository = module.get<ColorRepository>(ColorRepository);
  });

  it('should be defined', () => {
    expect(colorService).toBeDefined();
  });
});
