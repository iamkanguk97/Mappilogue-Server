import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MarkService } from '../services/mark.service';
import { UserId } from '../../user/decorators/user-id.decorator';
import { DeleteMarkRequestDto } from '../dtos/delete-mark-request.dto';
import { MarkValidationPipe } from '../pipes/mark-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateMarkImageMulterOption } from 'src/common/multer/multer.option';
import { FormDataJsonInterceptor } from 'src/interceptors/form-data-json.interceptor';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';
import { PostMarkValidationPipe } from '../pipes/post-mark-validation.pipe';
import { ResponseEntity } from 'src/entities/common/response.entity';
import { PostMarkResponseDto } from '../dtos/post-mark-response.dto';
import { MarkDto } from '../dtos/mark.dto';
import { MarkCategoryValidationPipe } from '../../mark-category/pipes/mark-category-validation.pipe';
import { DomainNameEnum } from 'src/constants/enum';

@Controller(DomainNameEnum.MARK)
@UseInterceptors(ClassSerializerInterceptor)
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @UseInterceptors(
    FilesInterceptor('image', 10, CreateMarkImageMulterOption()),
    FormDataJsonInterceptor,
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postMark(
    @UserId() userId: number,
    @UploadedFiles() files: Express.MulterS3.File[],
    @Body(PostMarkValidationPipe) body: PostMarkRequestDto,
  ): Promise<ResponseEntity<PostMarkResponseDto>> {
    const result = await this.markService.createMark(userId, files, body);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Delete('/:markId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMark(
    @UserId() userId: number,
    @Param(MarkValidationPipe) param: DeleteMarkRequestDto,
  ): Promise<void> {
    await this.markService.removeMark(userId, param.markId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkDetailById(@Query(MarkValidationPipe) mark: MarkDto) {
    const result = await this.markService.findMarkOnSpecificId(mark);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  // @Put('/:markId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async putMark() {
  //   return;
  // }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkListByCategoryId(
    @UserId() userId: number,
    @Query(MarkCategoryValidationPipe) query: any,
  ) {
    const result = await this.markService.findMarkListByCategoryId(
      userId,
      query.markCategoryId,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarksInUserPosition(@UserId() userId: number) {
    return;
  }
}
