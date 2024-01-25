import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ColorDto } from '../dtos/color.dto';
import { ColorRepository } from '../repositories/color.repository';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { ColorIdRangeEnum } from '../constants/color.enum';

@Injectable()
export class ColorService {
  constructor(private readonly colorRepository: ColorRepository) {}

  /**
   * @summary 색깔 리스트 조회하기 API Service
   * @author  Jason
   * @returns { Promise<ColorDto[]> }
   */
  async findColorList(): Promise<ColorDto[]> {
    const colors = await this.colorRepository.find();
    return colors.map((color) => ColorDto.of(color));
  }

  /**
   * @summary 특정 색깔 조회하기 By ColorId
   * @author  Jason
   * @param   { number } colorId
   * @returns { Promise<ColorDto> }
   */
  async findOneById(colorId: number): Promise<ColorDto> {
    if (colorId < ColorIdRangeEnum.MIN || colorId > ColorIdRangeEnum.MAX) {
      throw new BadRequestException(ColorExceptionCode.ColorIdRangeError);
    }

    const result = await this.colorRepository.findOne({
      where: {
        id: colorId,
      },
    });

    if (!result) {
      throw new InternalServerErrorException(ColorExceptionCode.ColorNotExist);
    }

    return ColorDto.of(result);
  }
}
