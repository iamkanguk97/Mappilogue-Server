import { Injectable } from '@nestjs/common';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { MarkMetadataDto } from '../dtos/mark-metadata.dto';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';

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
}
