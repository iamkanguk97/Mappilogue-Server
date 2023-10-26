import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { MarkCategoryService } from '../services/mark-category.service';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PostMarkCategoryRequestDto } from '../dtos/post-mark-category-request.dto';
import { ResponseEntity } from 'src/common/response-entity';
import { PostMarkCategoryResponseDto } from '../dtos/post-mark-category-response.dto';
import { PatchMarkCategoryTitleRequestDto } from '../dtos/patch-mark-category-title-request.dto';
import { MarkCategoryValidationPipe } from '../pipes/mark-category-validation.pipe';
import { DeleteMarkCategoryRequestDto } from '../dtos/delete-mark-category-request.dto';

@Controller('marks/categories')
export class MarkCategoryController {
  constructor(private readonly markCategoryService: MarkCategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkCategory() {
    return;
  }

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

  @Patch('titles')
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
  ): Promise<void> {
    await this.markCategoryService.removeMarkCategory(
      userId,
      param.markCategoryId,
    );
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putMarkCategory() {
    return;
  }
}
