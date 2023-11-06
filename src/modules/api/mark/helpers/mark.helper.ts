import { Injectable } from '@nestjs/common';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { MarkMetadataDto } from '../dtos/mark-metadata.dto';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';

@Injectable()
export class MarkHelper {
  constructor(
    private readonly scheduleService: ScheduleService, // private readonly markCategoryService: MarkCategoryService,
  ) {}

  isMarkExist(markStatus?: MarkEntity | undefined): boolean {
    return (
      !_.isNil(markStatus) && markStatus.status !== StatusColumnEnum.DELETED
    );
  }

  /**
   * @title 업로드된 이미지와 MarkMetadata와 Mapping
   * @param markId
   * @param files
   * @param metadata
   * @returns
   */
  mappingMarkMetadataWithImages(
    markId: number,
    files: Express.MulterS3.File[],
    metadata?: MarkMetadataDto[] | undefined,
  ): MarkMetadataEntity[] {
    return metadata.map((md, idx) =>
      MarkMetadataEntity.from(
        markId,
        files[idx].location,
        md.isMainImage,
        files[idx].key,
        md.caption,
      ),
    );
  }

  /**
   * @title 기록 관련 API 진행 시 에러 발생한 경우 Multer로 선 업로드된 사진 Delete
   * @param userId
   * @param markImages
   */
  async deleteUploadedMarkImageWhenError(
    userId: number,
    markImages:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[],
  ): Promise<void> {
    const imageDeleteBuilder = new MulterBuilder(
      ImageBuilderTypeEnum.DELETE,
      userId,
    );

    for (const idx in markImages) {
      await imageDeleteBuilder.delete(markImages[idx].key);
    }

    return;
  }
}
