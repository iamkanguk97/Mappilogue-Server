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
import { IMarkListByCategory, IMarkListInHome } from '../types';
import { USER_HOME_MARK_MAX_COUNT } from '../../user/constants/user-home.constant';
import { GetMarkSearchByOptionRequestDto } from '../dtos/request/get-mark-search-by-option-request.dto';
import { IMarkSearchByArea, IMarkSearchByMark } from '../../schedule/types';

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
   * @param   { number } userId
   * @param   { number } markCategoryId
   * @param   { PageOptionsDto } pageOptionsDto
   * @returns { Promise<ResultWithPageDto<IMarkListByCategory[]>> }
   */
  async selectMarkListByCategory(
    userId: number,
    markCategoryId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<IMarkListByCategory[]>> {
    const queryBuilder = this.createQueryBuilder('M');

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
        'IF(ML.scheduleAreaId IS NULL, ML.name, SA.name)',
        'locationName',
      )
      .addSelect(
        'IF(ML.scheduleAreaId IS NULL, ML.streetAddress, SA.streetAddress)',
        'streetAddress',
      )
      .addSelect(
        'IF(ML.scheduleAreaId IS NULL, ML.latitude, SA.latitude)',
        'latitude',
      )
      .addSelect(
        'IF(ML.scheduleAreaId IS NULL, ML.longitude, SA.longitude)',
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
      .orderBy('IF(ML.scheduleAreaId IS NULL, M.createdAt, SA.date)', 'DESC')
      .offset(pageOptionsDto.getOffset())
      .limit(pageOptionsDto.getLimit())
      .getRawMany();

    const itemCount = await queryBuilder.getCount();

    return ResultWithPageDto.from(
      result,
      new PageMetaDto({ pageOptionsDto, itemCount }),
    );
  }

  /**
   * @summary 홈화면 내 기록 리스트 조회
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<IMarkListInHome[]> }
   */
  async selectMarkListInHome(userId: number): Promise<IMarkListInHome[]> {
    return await this.createQueryBuilder('M')
      .select('M.id', 'id')
      .addSelect('M.title', 'title')
      .addSelect('M.markCategoryId', 'markCategoryId')
      .addSelect(
        `IF(M.markCategoryId IS NULL, "${MARK_CATEGORY_TOTAL_NAME}", MC.title)`,
        'markCategoryTitle',
      )
      .addSelect('M.colorId', 'colorId')
      .addSelect('C.code', 'colorCode')
      .addSelect(
        `IF(MM.isMainImage IS NULL, "${USER_DEFAULT_PROFILE_IMAGE}", MM.markImageUrl)`,
        'markImageUrl',
      )
      .addSelect(
        'CASE ' +
          'WHEN M.createdAt <= DATE_FORMAT(DATE_ADD(M.createdAt, INTERVAL 1 DAY), "%Y-%m-%d 00:00:00") AND NOW() <= DATE_FORMAT(DATE_ADD(M.createdAt, INTERVAL 1 DAY), "%Y-%m-%d 00:00:00") THEN "오늘" ' +
          'WHEN TIMESTAMPDIFF(DAY, M.createdAt, NOW()) = 0 THEN "1일 전" ' +
          'WHEN TIMESTAMPDIFF(DAY, M.createdAt, NOW()) <= 7 THEN CONCAT(TIMESTAMPDIFF(DAY, M.createdAt, NOW()), "일 전") ' +
          'ELSE DATE_FORMAT(M.createdAt, "%c월 %e일") ' +
          'END AS createdAt',
      )
      .innerJoin(ColorEntity, 'C', 'C.id = M.colorId')
      .leftJoin(MarkCategoryEntity, 'MC', 'MC.id = M.markCategoryId')
      .leftJoin(
        MarkMetadataEntity,
        'MM',
        'MM.markId = M.id AND MM.isMainImage = :isMainImage',
        { isMainImage: CheckColumnEnum.ACTIVE },
      )
      .where('M.userId = :userId', { userId })
      .andWhere('M.deletedAt IS NULL')
      .andWhere('C.deletedAt IS NULL')
      .andWhere('MC.deletedAt IS NULL')
      .andWhere('MM.deletedAt IS NULL')
      .orderBy('M.createdAt', 'DESC')
      .limit(USER_HOME_MARK_MAX_COUNT)
      .getRawMany();
  }

  /**
   * @summary 기록 검색 -> 장소로 기록 검색하기
   * @author  Jason
   * @param   { number } userId
   * @param   { GetMarkSearchByOptionRequestDto } query
   * @param   { PageOptionsDto } pageOptionsDto
   */
  async selectMarkSearchByArea(
    userId: number,
    query: GetMarkSearchByOptionRequestDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<IMarkSearchByArea[]>> {
    const result = await this.query(
      `
      SELECT *
      FROM (
        SELECT M.id AS markId,
               ML.id AS markLocationId,
               ML.scheduleAreaId AS scheduleAreaId,
               IF(ML.scheduleAreaId IS NULL, ML.name, SA.name) AS location_name,
               IF(ML.scheduleAreaId IS NULL, ML.streetAddress, SA.streetAddress) AS location_streetAddress,
               IF(ML.scheduleAreaId IS NULL, ML.latitude, SA.latitude) AS location_latitude,
               IF(ML.scheduleAreaId IS NULL, ML.longitude, SA.longitude) AS location_longtitude
        FROM Mark AS M
          INNER JOIN MarkLocation AS ML ON M.id = ML.markId
          INNER JOIN ScheduleArea AS SA ON SA.id = ML.scheduleAreaId
        WHERE M.userId = ?
              AND M.deletedAt IS NULL
              AND ML.deletedAt IS NULL
              AND SA.deletedAt IS NULL
      ) AS T
      WHERE (T.location_name LIKE ? OR T.location_streetAddress LIKE ?)
      ORDER BY (6371 * acos(cos(radians(?)) * cos(radians(T.location_latitude)) * cos(radians(?)
        - radians(T.location_longtitude)) + sin(radians(?)) * sin(radians(T.location_latitude))))
      LIMIT ?, ?
      `,
      [
        userId,
        `%${query.keyword}%`,
        `%${query.keyword}%`,
        query.lat,
        query.lon,
        query.lat,
        pageOptionsDto.getOffset(),
        pageOptionsDto.getLimit(),
      ],
    );

    return ResultWithPageDto.from(
      result,
      new PageMetaDto({ pageOptionsDto, itemCount: result.length }),
    );
  }

  /**
   * @summary 기록 검색 -> 기록 이름으로 기록 검색하기
   * @author  Jason
   * @param   { number } userId
   * @param   { GetMarkSearchByOptionRequestDto } query
   */
  async selectMarkSearchByMark(
    userId: number,
    query: GetMarkSearchByOptionRequestDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<IMarkSearchByMark[]>> {
    const result = await this.query(
      `
      SELECT M.id AS markId,
             M.title,
             M.colorId,
             C.code AS colorCode,
             ML.id AS markLocationId,
             ML.scheduleAreaId,
             IF(ML.scheduleAreaId IS NULL, ML.name, SA.name) AS location_name,
             IF(ML.scheduleAreaId IS NULL, ML.streetAddress, SA.streetAddress) AS location_streetAddress,
             IF(ML.scheduleAreaId IS NULL, ML.latitude, SA.latitude) AS location_latitude,
             IF(ML.scheduleAreaId IS NULL, ML.longitude, SA.longitude) AS location_longtitude
      FROM Mark AS M
        INNER JOIN Color AS C ON C.id = M.colorId
        LEFT JOIN MarkLocation AS ML ON M.id = ML.markId
        LEFT JOIN ScheduleArea AS SA ON SA.id = ML.scheduleAreaId
      WHERE M.title LIKE ?
            AND M.userId = ?
            AND M.deletedAt IS NULL
            AND ML.deletedAt IS NULL
            AND SA.deletedAt IS NULL
      ORDER BY IF(ML.scheduleAreaId IS NULL, M.createdAt, SA.date) DESC
      LIMIT ?, ?;
    `,
      [
        `%${query.keyword}%`,
        userId,
        pageOptionsDto.getOffset(),
        pageOptionsDto.getLimit(),
      ],
    );

    return ResultWithPageDto.from(
      result,
      new PageMetaDto({ pageOptionsDto, itemCount: result.length }),
    );
  }
}
