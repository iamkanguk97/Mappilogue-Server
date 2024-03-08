import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ColorService } from '../services/color.service';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ColorDto } from '../dtos/color.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { COLOR_LIST_CACHE_KEY } from '../constants/color.constant';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { CACHE_PERSISTANT_TTL } from 'src/constants/constant';
import { EDomainName } from 'src/constants/enum';

@Controller(EDomainName.COLOR)
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  /**
   * @summary 색깔 리스트 조회하기 API
   * @author  Jason
   * @url     [GET] /api/v1/colors/
   * @returns { Promise<ResponseEntity<ColorDto[]>> }
   */
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
