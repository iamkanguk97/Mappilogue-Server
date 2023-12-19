import { MARK_CATEGORY_TOTAL_NAME } from './../constants/mark-category.constant';
import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { MarkEntity } from '../entities/mark.entity';
import { Repository } from 'typeorm';
import { ColorEntity } from '../../color/entities/color.entity';
import { MarkLocationEntity } from '../entities/mark-location.entity';
import { MarkCategoryEntity } from '../entities/mark-category.entity';
import { MarkMetadataEntity } from '../entities/mark-metadata.entity';
import { CheckColumnEnum } from 'src/constants/enum';
import { USER_DEFAULT_PROFILE_IMAGE } from '../../user/constants/user.constant';
import { ScheduleAreaEntity } from '../../schedule/entities/schedule-area.entity';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { IMarkListByCategory } from '../types';

@CustomRepository(MarkEntity)
export class MarkRepository extends Repository<MarkEntity> {
  /**
   * @summary 카테고리가 없는 기록 개수 구하기
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<number> }
   */
  async selectMarkExceptCategoryCount(userId: number): Promise<number> {
    const result = await this.createQueryBuilder()
      .select('COUNT(*) AS markCount')
      .where('userId = :userId', { userId })
      .andWhere('markCategoryId IS NULL')
      .andWhere('deletedAt IS NULL')
      .getRawOne();
    return parseInt(result.markCount);
  }

  /**
   * @summary 특정 카테고리로 기록 리스트 구하기
   * @author  Jason
   *
   * @param   { number } userId
   * @param   { number } markCategoryId
   * @param   { PageOptionsDto } pageOptionsDto
   *
   * @returns { Promise<ResultWithPageDto<IMarkListByCategory[]>> }
   */
  async selectMarkListByCategory(
    userId: number,
    markCategoryId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<IMarkListByCategory[]>> {
    const queryBuilder = this.createQueryBuilder('M');

    console.log(pageOptionsDto);
    console.log(pageOptionsDto.page);
    console.log(pageOptionsDto.take);
    console.log((pageOptionsDto.page - 1) * pageOptionsDto.take);

    const result: IMarkListByCategory[] = await queryBuilder
      .select('M.id', 'id')
      .addSelect('M.markCategoryId', 'markCategoryId')
      .addSelect(
        `IF(M.markCategoryId IS NULL, "${MARK_CATEGORY_TOTAL_NAME}", MC.title)`,
        'markCategoryTitle',
      )
      .addSelect('M.title', 'markTitle')
      .addSelect('M.colorId', 'colorId')
      .addSelect('C.code', 'colorCode')
      .addSelect(
        `IF(MM.isMainImage IS NULL, "${USER_DEFAULT_PROFILE_IMAGE}", MM.markImageUrl)`,
        'markImageUrl',
      )
      .addSelect(
        'IFNULL(IF(ML.scheduleAreaId IS NULL, ML.name, SA.name), "")',
        'locationName',
      )
      .addSelect(
        'IFNULL(IF(ML.scheduleAreaId IS NULL, ML.streetAddress, SA.streetAddress), "")',
        'streetAddress',
      )
      .addSelect(
        'IFNULL(IF(ML.scheduleAreaId IS NULL, ML.latitude, SA.latitude), "")',
        'latitude',
      )
      .addSelect(
        'IFNULL(IF(ML.scheduleAreaId IS NULL, ML.longitude, SA.longitude), "")',
        'longitude',
      )
      .addSelect(
        'DATE_FORMAT(IF(ML.scheduleAreaId IS NULL, M.createdAt, SA.date), "%Y년 %c월 %e일")',
        'markDate',
      )
      .innerJoin(ColorEntity, 'C', 'C.id = M.colorId')
      .leftJoin(MarkLocationEntity, 'ML', 'ML.markId = M.id')
      .leftJoin(MarkCategoryEntity, 'MC', 'MC.id = M.markCategoryId')
      .leftJoin(
        MarkMetadataEntity,
        'MM',
        'MM.markId = M.id AND MM.isMainImage = :isMainImage',
        { isMainImage: CheckColumnEnum.ACTIVE },
      )
      .leftJoin(ScheduleAreaEntity, 'SA', 'SA.id = ML.scheduleAreaId')
      .where('M.userId = :userId', { userId })
      .andWhere(
        markCategoryId === -1
          ? 'M.markCategoryId IS NULL'
          : 'M.markCategoryId = :markCategoryId',
        { markCategoryId },
      )
      .andWhere('M.deletedAt IS NULL')
      .andWhere('MC.deletedAt IS NULL')
      .andWhere('C.deletedAt IS NULL')
      .andWhere('ML.deletedAt IS NULL')
      .andWhere('MM.deletedAt IS NULL')
      .andWhere('SA.deletedAt IS NULL')
      .orderBy(
        'DATE_FORMAT(IF(ML.scheduleAreaId IS NULL, M.createdAt, SA.date), "%Y년 %m월 %d일")',
        'DESC',
      )
      .offset((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .limit(pageOptionsDto.take)
      .getRawMany();

    const itemCount = await queryBuilder.getCount();

    return ResultWithPageDto.from(
      result,
      new PageMetaDto({ pageOptionsDto, itemCount }),
    );
  }
}
