import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { ResponseEntity } from 'src/common/response-entity';
import { ColorDto } from '../dtos/color.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { COLOR_LIST_CACHE_KEY } from '../constants/color.constant';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheKey(COLOR_LIST_CACHE_KEY)
  @CacheTTL(0)
  async colorList(): Promise<ResponseEntity<ColorDto[]>> {
    const colorListResult = await this.colorService.findColorList();
    return ResponseEntity.OK_WITH(HttpStatus.OK, colorListResult);
  }
}
