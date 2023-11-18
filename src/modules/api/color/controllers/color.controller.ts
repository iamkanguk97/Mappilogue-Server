import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { ResponseEntity } from 'src/entities/common/response.entity';
import { ColorDto } from '../dtos/color.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { COLOR_LIST_CACHE_KEY } from '../constants/color.constant';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { CACHE_PERSISTANT_TTL } from 'src/constants/constant';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
  @CacheKey(COLOR_LIST_CACHE_KEY)
  @CacheTTL(CACHE_PERSISTANT_TTL)
  async getColorList(): Promise<ResponseEntity<ColorDto[]>> {
    const colorListResult = await this.colorService.findColorList();
    return ResponseEntity.OK_WITH(HttpStatus.OK, colorListResult);
  }
}
