import { CustomRepository } from 'src/modules/core/custom-repository/decorators/custom-repository.decorator';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/page-meta.dto';

@CustomRepository(AnnouncementEntity)
export class AnnouncementRepository extends Repository<AnnouncementEntity> {
  /**
   * @summary 공지사항 조회 함수
   * @author  Jason
   * @param   { PageOptionsDto } pageOptionsDto
   * @returns { Promise<ResultWithPageDto<AnnouncementEntity[]>> }
   */
  async selectAnnouncements(
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<AnnouncementEntity[]>> {
    const queryBuilder = this.createQueryBuilder();

    const result = await queryBuilder
      .select('id')
      .addSelect('title')
      .addSelect('content')
      .addSelect(
        'DATE_FORMAT(createdAt, "%Y년 %c월 %e일") AS announcementCreatedAt',
      )
      .where('deletedAt IS NULL')
      .orderBy('createdAt', 'DESC')
      .offset(pageOptionsDto.getOffset())
      .limit(pageOptionsDto.getLimit())
      .getRawMany();

    const itemCount = await queryBuilder.getCount();

    return ResultWithPageDto.from(
      result,
      new PageMetaDto({ pageOptionsDto, itemCount }),
    );
  }
}
