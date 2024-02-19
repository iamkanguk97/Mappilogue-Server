import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { PostMarkRequestDto } from '../dtos/request/post-mark-request.dto';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { REQUEST } from '@nestjs/core';
import { MarkCategoryService } from '../services/mark-category.service';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import { MarkHelper } from '../helpers/mark.helper';
import { isDefined } from 'src/helpers/common.helper';
import { IRequestWithUserType } from 'src/types/request-with-user.type';

@Injectable()
export class PostMarkValidationPipe implements PipeTransform {
  private readonly logger = new Logger(PostMarkValidationPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: IRequestWithUserType,
    private readonly scheduleService: ScheduleService,
    private readonly markCategoryService: MarkCategoryService,
    private readonly markHelper: MarkHelper,
  ) {}

  async transform(value: PostMarkRequestDto): Promise<PostMarkRequestDto> {
    console.log(value);

    const userId = this.request.user.id;
    const markImages = this.request.files ?? [];

    try {
      /**
       * @Validate RequestDTO에 scheduleId가 있으면 => 유효성 검사 필요
       * - scheduleId가 없다 ==> 새로 작성한 기록
       */
      if (isDefined(value.scheduleId)) {
        await this.scheduleService.checkScheduleStatus(
          userId,
          value.scheduleId,
        );
      }

      /**
       * @Validate RequestDTO에 markCategoryId가 있으면 => 유효성 검사 필요
       * - markCategoryId가 없다 ==> 전체 카테고리
       */
      if (isDefined(value.markCategoryId)) {
        await this.markCategoryService.checkMarkCategoryStatus(
          userId,
          value.markCategoryId,
        );
      }

      /**
       * @Validate mainScheduleAreaId와 mainLocation이 둘다 없으면 안된다?
       * - 대표 위치는 정하지 않아도 된다고 기획이 변경됨 ==> 따라서 유효성 검사 X
       */
      // if (
      //   !isDefined(value.mainScheduleAreaId) &&
      //   (!isDefined(value.mainLocation) || isEmptyObject(value.mainLocation))
      // ) {
      //   throw new BadRequestException(
      //     MarkExceptionCode.MainScheduleAreaIdAndMainLocationBothNotInclude,
      //   );
      // }

      /**
       * @Validate RequestDTO에 mainScheduleAreaId와 mainLocation이 같이 있으면 안된다.
       */
      if (
        isDefined(value.mainScheduleAreaId) &&
        isDefined(value.mainLocation) &&
        Object.keys(value.mainLocation).length
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MainScheduleAreaIdAndMainLocationBothInclude,
        );
      }

      /**
       * @Validate RequestDTO에 mainScheduleAreaId가 있으면?
       * - scheduleId가 필수로 있어야 한다.
       * - mainScheduleAreaId에 대해 유효성 검사
       */
      if (isDefined(value.mainScheduleAreaId)) {
        if (!isDefined(value.scheduleId)) {
          throw new BadRequestException(
            MarkExceptionCode.MustScheduleIdExistWhenScheduleAreaIdExist,
          );
        }
        await this.scheduleService.checkScheduleAreaStatus(
          value.mainScheduleAreaId,
          value.scheduleId,
        );
      }

      /**
       * @Validate image 설정한 개수와 RequestDTO의 markMetadata 배열의 길이와 동일해야 한다.
       */
      if (markImages.length !== value.markMetadata.length) {
        throw new BadRequestException(
          MarkExceptionCode.MarkMetadataLengthError,
        );
      }

      /**
       * @Validate RequestDTO에 markMetadata가 있는 경우?
       * - content는 없어야 한다. (content는 이미지를 안올린 경우의 내용임)
       * - isMainImage는 무조건 1개여야 한다.
       */
      if (value.markMetadata.length !== 0) {
        if (isDefined(value.content) && value.content.length !== 0) {
          throw new BadRequestException(
            MarkExceptionCode.MarkContentNotExistWhenMetadatIsExist,
          );
        }
        if (!this.markHelper.checkMarkMainImageCanUpload(value.markMetadata)) {
          throw new BadRequestException(MarkExceptionCode.MarkMainImageMustOne);
        }
      }

      /**
       * @Validate content와 markMetadata가 모두 없는지 확인
       */
      if (
        (!isDefined(value.content) || !value.content.length) &&
        !value.markMetadata.length
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MarkContentAndMetadataEmpty,
        );
      }

      value.title = value.setMarkTitleByParam(value.title);
      value.content =
        isDefined(value.content) && !value.content.length
          ? null
          : value.content;

      return value;
    } catch (err) {
      this.logger.error(`[PostMarkValidationPipe] ${err}`);
      await this.markHelper.deleteUploadedMarkImageWhenError(
        this.request.files as Express.MulterS3.File[],
      );
      throw err;
    }
  }
}
