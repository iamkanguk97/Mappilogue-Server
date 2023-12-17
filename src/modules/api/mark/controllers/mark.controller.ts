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
import { MarkValidationPipe } from '../pipes/mark-validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateMarkImageMulterOption } from 'src/common/multer/multer.option';
import { FormDataJsonInterceptor } from 'src/interceptors/form-data-json.interceptor';
import { PostMarkRequestDto } from '../dtos/request/post-mark-request.dto';
import { PostMarkValidationPipe } from '../pipes/post-mark-validation.pipe';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { PostMarkResponseDto } from '../dtos/response/post-mark-response.dto';
import { MarkDto } from '../dtos/mark.dto';
import { MarkCategoryValidationPipe } from '../pipes/mark-category-validation.pipe';
import { DomainNameEnum } from 'src/constants/enum';
import {
  POST_MARK_IMAGE_KEY,
  POST_MARK_IMAGE_LIMIT,
} from '../constants/mark.constant';
import { GetMarkDetailByIdResponseDto } from '../dtos/get-mark-detail-by-id-response.dto';

@Controller(DomainNameEnum.MARK)
@UseInterceptors(ClassSerializerInterceptor)
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  /**
   * @summary 기록 생성하기 API
   * @author  Jason
   * @url     /api/v1/marks
   * @returns { Promise<ResponseEntity<PostMarkResponseDto>> }
   */
  @UseInterceptors(
    FilesInterceptor(
      POST_MARK_IMAGE_KEY,
      POST_MARK_IMAGE_LIMIT,
      CreateMarkImageMulterOption(),
    ),
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

  /**
   * @summary 기록 삭제하기 API
   * @author  Jason
   * @url     [DELETE] /api/v1/marks/{markId}
   */
  @Delete('/:markId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMark(
    @UserId() userId: number,
    @Param(MarkValidationPipe) mark: MarkDto,
  ): Promise<void> {
    await this.markService.removeMark(userId, mark.id);
  }

  /**
   * @summary 특정 기록 조회하기 API
   * @author  Jason
   * @url     [GET] /api/v1/marks?markId=
   * @returns { ResponseEntity<GetMarkDetailByIdResponseDto> }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkDetailById(
    @Query(MarkValidationPipe) mark: MarkDto,
  ): Promise<ResponseEntity<GetMarkDetailByIdResponseDto>> {
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
