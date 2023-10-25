import { Injectable } from '@nestjs/common';
import { ColorDto } from '../dtos/color.dto';
import { ColorEntity } from '../entities/color.entity';

@Injectable()
export class ColorService {
  async findColorList(): Promise<ColorDto[]> {
    const colors = await ColorEntity.selectColorList();
    return ColorDto.of(colors);
  }
}
