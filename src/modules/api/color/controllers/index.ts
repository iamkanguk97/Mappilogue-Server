import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ColorService } from '../services';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async colorList() {
    return this.colorService.findColorList();
  }
}
