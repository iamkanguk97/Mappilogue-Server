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
  Put,
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
import { DomainNameEnum } from 'src/constants/enum';
import {
  POST_MARK_IMAGE_KEY,
  POST_MARK_IMAGE_LIMIT,
} from '../constants/mark.constant';
import { GetMarkDetailByIdResponseDto } from '../dtos/response/get-mark-detail-by-id-response.dto';
import { GetMarkListByCategoryRequestDto } from '../dtos/request/get-mark-list-by-category-request.dto';
import { GetMarkListByCategoryValidationPipe } from '../pipes/get-mark-list-by-category-validation.pipe';
import { GetPagination } from 'src/decorators/get-paginate.decorator';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { GetMarkListByCategoryResponseDto } from '../dtos/response/get-mark-list-by-category-response.dto';
import { ResponseWithPageEntity } from 'src/common/entities/response-with-page.entity';
import { PutMarkRequestDto } from '../dtos/request/put-mark-request.dto';
import { GetMarkSearchByOptionRequestDto } from '../dtos/request/get-mark-search-by-option-request.dto';

@Controller(DomainNameEnum.MARK)
@UseInterceptors(ClassSerializerInterceptor)
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  /**
   * @summary 기록 생성하기 API
   * @author  Jason
   * @url     [POST] /api/v1/marks
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
   * @url     [GET] /api/v1/marks/details?markId=
   * @returns { ResponseEntity<GetMarkDetailByIdResponseDto> }
   */
  @Get('/details')
  @HttpCode(HttpStatus.OK)
  async getMarkDetailById(
    @Query(MarkValidationPipe) mark: MarkDto,
  ): Promise<ResponseEntity<GetMarkDetailByIdResponseDto>> {
    const result = await this.markService.findMarkOnSpecificId(mark);
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 기록 수정하기 API
   * @author  Jason
   * @url     [PUT] /api/v1/marks/{markId}
   */
  @UseInterceptors(
    FilesInterceptor(
      POST_MARK_IMAGE_KEY,
      POST_MARK_IMAGE_LIMIT,
      CreateMarkImageMulterOption(),
    ),
    FormDataJsonInterceptor,
  )
  @Put('/:markId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async putMark(
    @Param(MarkValidationPipe) mark: MarkDto,
    @Body(PostMarkValidationPipe) body: PutMarkRequestDto,
    @UploadedFiles() files: Express.MulterS3.File[],
  ): Promise<void> {
    await this.markService.modifyMark(mark, body, files);
  }

  /**
   * @summary 특정 카테고리의 기록 리스트 조회하기 API
   * @author  Jason
   * @url     [GET] /api/v1/marks?markCategoryId=
   * @returns { Promise<ResponseWithPageEntity<GetMarkListByCategoryResponseDto>> }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMarkListByCategory(
    @UserId() userId: number,
    @Query(GetMarkListByCategoryValidationPipe)
    query: GetMarkListByCategoryRequestDto,
    @GetPagination() pageOptionsDto: PageOptionsDto,
  ): Promise<ResponseWithPageEntity<GetMarkListByCategoryResponseDto>> {
    const result = await this.markService.findMarkListByCategory(
      userId,
      query.markCategoryId,
      pageOptionsDto,
    );
    return ResponseWithPageEntity.OK_WITH_PAGINATION(HttpStatus.OK, result);
  }

  /**
   * @summary 본인 위치에서 기록 리스트 조회하기 API
   * @author  Jason
   * @url     [GET] /api/v1/marks/positions?x=&y=
   */
  @Get('/positions')
  @HttpCode(HttpStatus.OK)
  async getMarksInUserPosition() {
    return;
  }

  /**
   * @summary 기록 검색하기 API
   * @author  Jason
   * @url     [GET] /api/v1/marks/searches?keyword=&option=&pageNo=&pageSize=
   */
  @Get('/searches')
  @HttpCode(HttpStatus.OK)
  async getMarkSearchByOption(
    @UserId() userId: number,
    @Query() query: GetMarkSearchByOptionRequestDto,
    @GetPagination() pageOptionsDto: PageOptionsDto,
  ): Promise<any> {
    const result = await this.markService.findMarkSearchByOption(
      userId,
      query,
      pageOptionsDto,
    );
    // return ResponseWithPageEntity.OK_WITH_PAGINATION(HttpStatus.OK, result);
  }
}
