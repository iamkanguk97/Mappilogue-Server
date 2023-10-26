import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { MarkCategoryService } from '../services/mark-category.service';
import { UserId } from '../../user/decorators/user-id.decorator';
import { ResponseEntity } from 'src/common/response-entity';

@Controller('marks/categories')
export class MarkCategoryController {
  constructor(private readonly markCategoryService: MarkCategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkCategories(@UserId() userId: number) {
    const result = await this.markCategoryService.findMarkCategories(userId);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postMarkCategory() {
    return;
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchMarkCategoryTitle() {
    return;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMarkCategory() {
    return;
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async putMarkCategory() {
    return;
  }
}
