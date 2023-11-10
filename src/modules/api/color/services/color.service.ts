import { BadRequestException, Injectable } from '@nestjs/common';
import { ColorDto } from '../dtos/color.dto';
import { ColorRepository } from '../repositories/color.repository';
import { ColorExceptionCode } from 'src/common/exception-code/color.exception-code';
import { ColorIdRangeEnum } from '../constants/color.enum';

@Injectable()
export class ColorService {
  constructor(private readonly colorRepository: ColorRepository) {}

  async findColorList(): Promise<ColorDto[]> {
    const colors = await this.colorRepository.find({
      withDeleted: false,
    });
    return colors.map((color) => ColorDto.of(color));
  }

  async findOneById(colorId: number): Promise<ColorDto> {
    if (colorId < ColorIdRangeEnum.MIN || colorId > ColorIdRangeEnum.MAX) {
      throw new BadRequestException(ColorExceptionCode.ColorIdRangeError);
    }

    const result = await this.colorRepository.findOne({
      where: {
        id: colorId,
      },
    });

    return ColorDto.of(result);
  }
}
