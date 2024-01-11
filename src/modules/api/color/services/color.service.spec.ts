import { Test, TestingModule } from '@nestjs/testing';
import { ColorService } from './color.service';
import { ColorRepository } from '../repositories/color.repository';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorEntity } from '../entities/color.entity';
import { DatabaseModule } from 'src/modules/core/database/database.module';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { BadRequestException } from '@nestjs/common';
import { ColorDto } from '../dtos/color.dto';
import { plainToInstance } from 'class-transformer';

describe('ColorService', () => {
  let colorService: ColorService;
  let colorRepository: ColorRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([ColorEntity]),
        CustomRepositoryModule.forCustomRepository([ColorRepository]),
      ],
      providers: [ColorService],
    }).compile();

    colorService = module.get<ColorService>(ColorService);
    colorRepository = module.get<ColorRepository>(ColorRepository);
  });

  it('ColorService와 ColorRepository가 정의되어 있어야 합니다.', () => {
    expect(colorService).toBeDefined();
    expect(colorRepository).toBeDefined();
  });

  describe('ColorService - findOneById', () => {
    it('파라미터로 들어온 colorId가 1부터 15 사이의 숫자가 아니면 에러를 발생시키는가?', async () => {
      await expect(colorService.findOneById(16)).rejects.toThrowError(
        new BadRequestException(ColorExceptionCode.ColorIdRangeError),
      );
    });

    it('정상적인 colorId를 전달받았을 때 일치하는 색깔 데이터를 조회해야 합니다.', async () => {
      const expectedColor = plainToInstance(ColorEntity, {
        id: 1,
        code: '#FFA1A1',
        name: 'Red',
      });

      expect(await colorService.findOneById(1)).toEqual(
        ColorDto.of(expectedColor),
      );
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
