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
