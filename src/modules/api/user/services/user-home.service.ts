import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';

@Injectable()
export class UserHomeService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
  ) {}

  /**
   * @summary 공지사항 조회 API Service
   * @author  Jason
   * @param   { PageOptionsDto } pageOptionsDto
   * @returns { Promise<ResultWithPageDto<AnnouncementEntity[]>> }
   */
  async findAnnouncements(
    pageOptionsDto: PageOptionsDto,
  ): Promise<ResultWithPageDto<AnnouncementEntity[]>> {
    return await this.announcementRepository.selectAnnouncements(
      pageOptionsDto,
    );
  }
}
