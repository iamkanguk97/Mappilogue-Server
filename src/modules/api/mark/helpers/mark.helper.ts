import { isDefined } from 'src/helpers/common.helper';
import { Injectable } from '@nestjs/common';
import { MarkEntity } from '../entities/mark.entity';
import { CheckColumnEnum, StatusColumnEnum } from 'src/constants/enum';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { MarkMetadataDto } from '../dtos/mark-metadata.dto';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { PostMarkRequestDto } from '../dtos/post-mark-request.dto';
import { MarkLocationEntity } from '../entities/mark-location.entity';

@Injectable()
export class MarkHelper {
  constructor(
    private readonly scheduleService: ScheduleService, // private readonly markCategoryService: MarkCategoryService,
  ) {}

  /**
   * @title 해당 기록이 존재하는지 확인
   * @param markStatus
   * @returns
   */
  isMarkExist(markStatus?: MarkEntity | undefined): boolean {
    return (
      isDefined(markStatus) && markStatus.status !== StatusColumnEnum.DELETED
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

  /**
   * @title MarkLocation을 insert할 Parameter를 만들어주는 함수
   * @param markId
   * @param body
   * @returns
   */
  setCreateMarkLocationParam(
    markId: number,
    body: PostMarkRequestDto,
  ): MarkLocationEntity {
    if (isDefined(body.mainScheduleAreaId)) {
      return body.toMarkLocationEntity(markId, body.mainScheduleAreaId);
    }
    return body.mainLocation.toMarkLocationEntity(markId);
  }

  /**
   * @title markMetadata의 배열에서 isMainImage가 ACTIVE인 값 개수 파악하는 함수
   * @param metadata
   * @returns
   */
  getMarkMainImageStatusCount(metadata: MarkMetadataDto[]): number {
    return metadata.reduce(
      (acc, obj) =>
        obj.isMainImage === CheckColumnEnum.ACTIVE ? acc + 1 : acc,
      0,
    );
  }

  /**
   * @title 대표 이미지 업로드 가능한지 확인하는 함수
   * @param metadata
   * @returns
   */
  checkMarkMainImageCanUpload(metadata: MarkMetadataDto[]): boolean {
    const isMainImageCount = this.getMarkMainImageStatusCount(metadata);
    return isMainImageCount === 1;
  }
}
