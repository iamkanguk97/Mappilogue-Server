import { Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { MarkRepository } from '../../mark/repositories/mark.repository';
import { GetHomeOptionEnum } from '../constants/user.enum';

@Injectable()
export class UserHomeService {
  constructor(
    private readonly markRepository: MarkRepository,
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

  /**
   * @summary 홈화면 조회 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { GetHomeOptionEnum } option
   * @returns { Promise<GetHomeResponseDto> }
   */
  async findHomes(userId: number, option: GetHomeOptionEnum): Promise<any> {
    // 마크한 기록
    const marks = await this.findMarksInHomes(userId);
    console.log(marks);
    return;
  }

  /**
   * @summary 홈화면 조회 API Service -> 마크한 기록
   * @author  Jason
   * @returns
   */
  async findMarksInHomes(userId: number) {
    /**
     * - 마크한 기록은 최대 3개 (OK)
     * - 최신순으로 정렬 (OK)
     * - 오늘 -> 1~7일 전 -> 0월 00일
     */
    return await this.markRepository.selectMarkListInHome(userId);
  }
}
