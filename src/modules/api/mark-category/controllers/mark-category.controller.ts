import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MarkCategoryService } from '../services/mark-category.service';
import { UserId } from '../../user/decorators/user-id.decorator';
import { ResponseEntity } from 'src/entities/common/response.entity';
import { PostMarkCategoryRequestDto } from '../dtos/post-mark-category-request.dto';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/patch-mark-category-title-request.dto';
import { DeleteMarkCategoryRequestDto } from '../dtos/delete-mark-category-request.dto';
import { PutMarkCategoryRequestDto } from '../dtos/put-mark-category-request.dto';
import { DeleteMarkCategoryOptionRequestDto } from '../dtos/delete-mark-category-option-request.dto';
import { GetMarkCategoriesResponseDto } from '../dtos/get-mark-categories-response.dto';
import { MarkCategoryValidationPipe } from '../pipes/mark-category-validation.pipe';
import { CacheTTL } from '@nestjs/cache-manager';
import { CACHE_COMMON_TTL } from 'src/constants/constant';
import { DomainNameEnum } from 'src/constants/enum';

@Controller(DomainNameEnum.MARK_CATEGORY)
export class MarkCategoryController {
  constructor(private readonly markCategoryService: MarkCategoryService) {}

  @CacheTTL(CACHE_COMMON_TTL)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMarkCategories(
    @UserId() userId: number,
  ): Promise<ResponseEntity<GetMarkCategoriesResponseDto>> {
    const result = await this.markCategoryService.findMarkCategories(userId);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async postMarkCategory(
    @UserId() userId: number,
    @Body() body: PostMarkCategoryRequestDto,
  ): Promise<ResponseEntity<PostMarkCategoryResponseDto>> {
    const result = await this.markCategoryService.createMarkCategory(
      userId,
      body.title,
    );

    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchMarkCategoryTitle(
    @UserId() userId: number,
    @Body(MarkCategoryValidationPipe) body: PatchMarkCategoryTitleRequestDto,
  ): Promise<void> {
    await this.markCategoryService.modifyMarkCategoryTitle(userId, body);
  }

  @Delete('/:markCategoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMarkCategory(
    @UserId() userId: number,
    @Param(MarkCategoryValidationPipe) param: DeleteMarkCategoryRequestDto,
    @Query() query: DeleteMarkCategoryOptionRequestDto,
  ): Promise<void> {
    await this.markCategoryService.removeMarkCategory(
      userId,
      param.markCategoryId,
      query.option,
    );
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putMarkCategories(
    @UserId() userId: number,
    @Body() body: PutMarkCategoryRequestDto,
  ): Promise<void> {
    await this.markCategoryService.modifyMarkCategory(userId, body.categories);
  }
}
