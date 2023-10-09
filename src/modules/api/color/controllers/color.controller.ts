import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { ResponseEntity } from 'src/common/response/response-entity';
import { ColorDto } from '../dtos/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async colorList(): Promise<ResponseEntity<ColorDto[]>> {
    const colorListResult = await this.colorService.findColorList();
    return ResponseEntity.OK_WITH(HttpStatus.OK, colorListResult);
  }
}
