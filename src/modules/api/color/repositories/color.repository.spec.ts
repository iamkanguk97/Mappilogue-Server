import { Test, TestingModule } from '@nestjs/testing';
import { ColorRepository } from './color.repository';

describe('ColorRepository', () => {
  let colorRepository: ColorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorRepository],
    }).compile();

    colorRepository = module.get<ColorRepository>(ColorRepository);
  });

  it('ColorRepository should be defined', () => {
    expect(colorRepository).toBeDefined();
  });
});
