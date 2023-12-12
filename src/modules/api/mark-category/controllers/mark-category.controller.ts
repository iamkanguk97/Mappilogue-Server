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
import { ResponseEntity } from 'src/common/entities/response.entity';
import { PostMarkCategoryRequestDto } from '../dtos/post-mark-category-request.dto';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/patch-mark-category-title-request.dto';
import { DeleteMarkCategoryRequestDto } from '../dtos/delete-mark-category-request.dto';
import { PutMarkCategoryRequestDto } from '../dtos/put-mark-category-request.dto';
import { DeleteMarkCategoryOptionRequestDto } from '../dtos/delete-mark-category-option-request.dto';
import { GetMarkCategoriesResponseDto } from '../dtos/get-mark-categories-response.dto';
import { MarkCategoryValidationPipe } from '../pipes/mark-category-validation.pipe';
import { DomainNameEnum } from 'src/constants/enum';

@Controller(DomainNameEnum.MARK_CATEGORY)
@UseInterceptors(ClassSerializerInterceptor)
export class MarkCategoryController {
  constructor(private readonly markCategoryService: MarkCategoryService) {}

  /**
   * @summary 기록 카테고리 조회 API
   * @author Jason
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkCategories(
    @UserId() userId: number,
  ): Promise<ResponseEntity<GetMarkCategoriesResponseDto>> {
    const result = await this.markCategoryService.findMarkCategories(userId);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 기록 카테고리 생성 API
   * @author Jason
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
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

  /**
   * @summary 기록 카테고리 이름 수정 API
   * @author Jason
   */
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchMarkCategoryTitle(
    @UserId() userId: number,
    @Body(MarkCategoryValidationPipe) body: PatchMarkCategoryTitleRequestDto,
  ): Promise<void> {
    await this.markCategoryService.modifyMarkCategoryTitle(userId, body);
  }

  /**
   * @summary 기록 카테고리 삭제 API
   * @author Jason
   */
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

  /**
   * @summary 기록 카테고리 순서 수정 API
   * @author Jason
   */
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putMarkCategories(
    @UserId() userId: number,
    @Body() body: PutMarkCategoryRequestDto,
  ): Promise<void> {
    await this.markCategoryService.modifyMarkCategory(userId, body.categories);
  }
}
