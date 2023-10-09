import { Injectable } from '@nestjs/common';
import { ColorRepository } from '../repositories/color.repository';
import { ColorDto } from '../dtos/color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly colorRepository: ColorRepository) {}

  async findColorList(): Promise<ColorDto[]> {
    const colors = await this.colorRepository.find();
    return colors.map(ColorDto.fromEntity);
  }
}
