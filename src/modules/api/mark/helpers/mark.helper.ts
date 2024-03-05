import { isDefined } from 'src/helpers/common.helper';
import { Injectable } from '@nestjs/common';
import { CheckColumnEnum } from 'src/constants/enum';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import {
  PostMarkMetadataObject,
  PostMarkRequestDto,
} from '../dtos/request/post-mark-request.dto';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { MarkEntity } from '../entities/mark.entity';

@Injectable()
export class MarkHelper {
  /**
   * @summary 업로드된 이미지와 MarkMetadata와 Mapping
   * @author Jason
   * @param { number } markId
   * @param { Express.MulterS3.File[] } files
   * @param { PostMarkMetadataObject[] } metadatas
   * @returns { MarkMetadataEntity[] }
   */
  mappingMarkMetadataWithImages(
    markId: number,
    files: Express.MulterS3.File[],
    metadatas: PostMarkMetadataObject[],
  ): MarkMetadataEntity[] {
    return metadatas.map((metadata, idx) =>
      MarkMetadataEntity.from(
        markId,
        files[idx].location,
        metadata.isMainImage,
        files[idx].key,
        metadata.caption,
      ),
    );
  }

  /**
   * @summary 기록 관련 API 진행 시 에러 발생한 경우 Multer로 선 업로드된 사진 Delete
   * @author Jason
   * @param { Express.Multer.File[] } markImages
   */
  async deleteUploadedMarkImageWhenError(
    markImages: Express.MulterS3.File[],
  ): Promise<void> {
    const imageDeleteBuilder = new MulterBuilder(ImageBuilderTypeEnum.DELETE);

    for (const idx in markImages) {
      await imageDeleteBuilder.delete(markImages[idx].key);
    }
  }

  /**
   * @summary MarkLocation을 insert할 Parameter를 만들어주는 함수
   * @author Jason
   * @param { number } markId
   * @param { PostMarkRequestDto } body
   * @return { MarkLocationEntity | undefined }
   */
  setCreateMarkLocationParam(
    markId: number,
    body: PostMarkRequestDto,
  ): MarkLocationEntity {
    if (isDefined(body.mainScheduleAreaId)) {
      return body.toMarkLocationEntityWithScheduleAreaId(
        markId,
        body.mainScheduleAreaId,
      );
    }

    if (isDefined(body.mainLocation)) {
      return body.toMarkLocationEntityWithLocationInfo(
        markId,
        body.mainLocation,
      );
    }

    return {} as MarkLocationEntity;
  }

  /**
   * @summary markMetadata의 배열에서 isMainImage가 ACTIVE인 값 개수 파악하는 함수
   * @author  Jason
   * @param   { PostMarkMetadataObject[] } metadata
   * @returns { number}
   */
  getMarkMainImageStatusCount(metadata: PostMarkMetadataObject[]): number {
    return metadata.reduce(
      (acc, obj) =>
        obj.isMainImage === CheckColumnEnum.ACTIVE ? acc + 1 : acc,
      0,
    );
  }

  /**
   * @summary 대표 이미지가 1개인지 확인하는 함수
   * @author  Jason
   * @param   { PostMarkMetadataObject[] } metadata
   * @returns { boolean }
   */
  checkMarkMainImageCanUpload(metadata: PostMarkMetadataObject[]): boolean {
    // MarkMetadata가 없으면 이미지가 없는거임 --> 대표 이미지 설정할 필요 없음
    if (!metadata.length) {
      return true;
    }
    const isMainImageCount = this.getMarkMainImageStatusCount(metadata);
    return isMainImageCount === 1;
  }

  /**
   * @summary 기록 수정 시 기록 카테고리 아이디를 통한 조건 생성 함수
   * @author  Jason
   * @param   { number } markCategoryId
   * @returns { Pick<MarkEntity, 'markCategoryId'> }
   */
  setUpdateMarkCriteriaWithMarkCategory(
    markCategoryId: number,
  ): Pick<MarkEntity, 'markCategoryId'> {
    return { markCategoryId };
  }
}
