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
import { isDefined, isEmptyObject } from 'src/helpers/common.helper';
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
    const userId = this.request.user.id;
    const markImages = this.request['files'];
    const markMetadata = value.markMetadata ?? [];

    let isScheduleIdExistInParameter = false; // RequestDTO에 scheduleId가 있는지 판단하는 변수

    try {
      /**
       * @Validate RequestDTO에 scheduleId가 있으면 => 유효성 검사 필요
       */
      if (isDefined(value.scheduleId)) {
        isScheduleIdExistInParameter = true;
        await this.scheduleService.checkScheduleStatus(
          userId,
          value.scheduleId,
        );
      }

      /**
       * @Validate RequestDTO에 markCategoryId가 있으면 => 유효성 검사 필요
       */
      if (isDefined(value.markCategoryId)) {
        await this.markCategoryService.checkMarkCategoryStatus(
          userId,
          value.markCategoryId,
        );
      }

      /**
       * @TODO 기획 확인하기!!
       * @Validate mainScheduleAreaId와 mainLocation이 둘다 없으면 안된다?
       */
      if (
        !isDefined(value.mainScheduleAreaId) &&
        (!isDefined(value.mainLocation) || isEmptyObject(value.mainLocation))
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MainScheduleAreaIdAndMainLocationBothNotInclude,
        );
      }

      /**
       * @Validate RequestDTO에 mainScheduleAreaId와 mainLocation이 같이 있으면 안된다.
       */
      if (
        isDefined(value.mainScheduleAreaId) &&
        isDefined(value.mainLocation) &&
        !isEmptyObject(value.mainLocation)
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MainScheduleAreaIdAndMainLocationBothInclude,
        );
      }

      /**
       * @Validate RequestDTO에 mainScheduleAreaId가 있으면?
       * - scheduleId가 필수로 있어야 한다.
       */
      if (
        isDefined(value.mainScheduleAreaId) &&
        !isScheduleIdExistInParameter
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MustScheduleIdExistWhenScheduleAreaIdExist,
        );
      }

      /**
       * @Validate RequestDTO에 mainScheduleAreaId가 있으면?
       * - 위에가 확인되면 mainScheduleAreaId에 대해 유효성 검사.
       */
      if (isDefined(value.mainScheduleAreaId) && isScheduleIdExistInParameter) {
        await this.scheduleService.checkScheduleAreaStatus(
          value.mainScheduleAreaId,
          value.scheduleId,
        );
      }

      /**
       * @Validate image 설정한 개수와 RequestDTO의 markMetadata 배열의 길이와 동일해야 한다.
       */
      if (markImages.length !== markMetadata.length) {
        throw new BadRequestException(
          MarkExceptionCode.MarkMetadataLengthError,
        );
      }

      /**
       * @Validate RequestDTO에 markMetadata가 있는 경우?
       * - content는 없어야 한다. (content는 이미지를 안올린 경우의 내용임)
       */
      if (
        isDefined(markMetadata) &&
        markMetadata.length !== 0 &&
        isDefined(value.content) &&
        value.content.length !== 0
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MarkContentNotExistWhenMetadatIsExist,
        );
      }

      /**
       * @Validate RequestDTO에 markMetadata가 있는 경우?
       * - isMainImage는 무조건 1개여야 한다.
       */
      if (!this.markHelper.checkMarkMainImageCanUpload(markMetadata)) {
        throw new BadRequestException(MarkExceptionCode.MarkMainImageMustOne);
      }

      /**
       * @Validate content와 markMetadata가 모두 없는지 확인
       */
      if (
        (!isDefined(value.content) || !value.content.length) &&
        !markMetadata.length
      ) {
        throw new BadRequestException(
          MarkExceptionCode.MarkContentAndMetadataEmpty,
        );
      }

      return value;
    } catch (err) {
      this.logger.error(`[PostMarkValidationPipe] ${err}`);
      await this.markHelper.deleteUploadedMarkImageWhenError(
        userId,
        markImages,
      );
      throw err;
    }
  }
}
