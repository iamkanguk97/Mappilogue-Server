import { Test, TestingModule } from '@nestjs/testing';
import { ColorController } from './color.controller';
import { ColorService } from '../services/color.service';
import { ColorRepository } from '../repositories/color.repository';

describe('ColorController', () => {
  let colorController: ColorController;
  let colorService: ColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorController],
      providers: [ColorService, ColorRepository],
    }).compile();

    colorController = module.get<ColorController>(ColorController);
    colorService = module.get<ColorService>(ColorService);
  });

  it('should be defined', () => {
    expect(colorController).toBeDefined();
  });

  describe('colorList', () => {
    it('should call the service', async () => {
      console.log('asdf');
    });
  });
});
