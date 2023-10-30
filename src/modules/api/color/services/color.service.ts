import { Injectable } from '@nestjs/common';
import { ColorDto } from '../dtos/color.dto';
import { ColorRepository } from '../repositories/color.repository';

@Injectable()
export class ColorService {
  constructor(private readonly colorRepository: ColorRepository) {}

  async findColorList(): Promise<ColorDto[]> {
    const colors = await this.colorRepository.find();
    return ColorDto.ofByArray(colors);
  }

  async findOneById(colorId: number): Promise<ColorDto> {
    const result = await this.colorRepository.findOne({
      where: {
        id: colorId,
      },
    });
    return ColorDto.ofByValue(result);
  }
}
