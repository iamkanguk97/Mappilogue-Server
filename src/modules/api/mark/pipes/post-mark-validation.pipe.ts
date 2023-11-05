import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { MarkCategoryService } from '../../mark-category/services/mark-category.service';
import { MarkExceptionCode } from 'src/common/exception-code/mark.exception-code';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { CheckColumnEnum } from 'src/constants/enum';

@Injectable()
export class PostMarkValidationPipe implements PipeTransform {
  private readonly logger = new Logger(PostMarkValidationPipe.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly scheduleService: ScheduleService,
    private readonly markCategoryService: MarkCategoryService,
  ) {}

  async transform(value: PostMarkRequestDto): Promise<PostMarkRequestDto> {
    const userId = this.request['user'].id;
    const markImages = this.request['files'];
    const markMetadata = value.markMetadata ?? [];

    try {
      // scheduleId가 null이 아니면 scheduleStatus를 확인하고 ColorId Update 필요
      if (!_.isNil(value?.scheduleId)) {
        await this.scheduleService.checkScheduleStatus(
          userId,
          value.scheduleId,
        );
      }

      // markCategoryId가 null이 아니면 유효성 검사 필요
      if (!_.isNil(value?.markCategoryId)) {
        await this.markCategoryService.checkMarkCategoryStatus(
          userId,
          value.markCategoryId,
        );
      }

      if (markImages.length !== markMetadata.length) {
        throw new BadRequestException(
          MarkExceptionCode.MarkMetadataLengthError,
        );
      }

      // markMetadata가 null이 아니면 isMainImage가 무조건 1개여야함
      if (!_.isNil(value?.markMetadata)) {
        const isMainImageCount = value.markMetadata.reduce(
          (acc, obj) =>
            obj.isMainImage === CheckColumnEnum.ACTIVE ? acc + 1 : acc,
          0,
        );

        if (isMainImageCount === 0 || isMainImageCount > 1) {
          throw new BadRequestException(MarkExceptionCode.MarkMainImageMustOne);
        }
      }

      return value;
    } catch (err) {
      this.logger.error(`[PostMarkValidationPipe] ${err}`);

      if (
        err.response.code === MarkExceptionCode.MarkMetadataLengthError.code
      ) {
        const imageDeleteBuilder = new MulterBuilder(
          ImageBuilderTypeEnum.DELETE,
          userId,
        );

        for (const idx in markImages) {
          await imageDeleteBuilder.delete(markImages[idx].key);
        }
      }

      throw err;
    }
  }
}