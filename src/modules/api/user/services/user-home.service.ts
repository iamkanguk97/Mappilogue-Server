import { BadRequestException, Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { MarkRepository } from '../../mark/repositories/mark.repository';
import { GetHomeOptionEnum } from '../constants/enums/user-home.enum';
import { IMarkListInHome } from '../../mark/types';
import { GetHomeResponseDto } from '../dtos/response/get-home-response.dto';
import { ScheduleRepository } from '../../schedule/repositories/schedule.repository';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { ScheduleAreaRepository } from '../../schedule/repositories/schedule-area.repository';
import { IScheduleListInHomeOnToday } from '../../schedule/types';

@Injectable()
export class UserHomeService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly scheduleAreaRepository: ScheduleAreaRepository,
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
  async findHomes(
    userId: number,
    option: GetHomeOptionEnum,
  ): Promise<GetHomeResponseDto> {
    const [schedules, marks] = await Promise.all([
      this.findSchedulesInHomesByOption(userId, option),
      this.findMarksInHomes(userId),
    ]);

    return GetHomeResponseDto.from(schedules, marks);
  }

  /**
   * @summary 홈화면 조회 API Service -> 마크한 기록
   * @author  Jason
   * @param  { number } userId
   * @returns { Promise<IMarkListInHome[]> }
   */
  async findMarksInHomes(userId: number): Promise<IMarkListInHome[]> {
    return await this.markRepository.selectMarkListInHome(userId);
  }

  /**
   * @summary 홈화면 조회 API Service -> 오늘/다가오는 일정
   * @author  Jason
   * @param   { number } userId
   * @param   { GetHomeOptionEnum } option
   * @returns { Promise<IScheduleListInHomeOnToday[]> }
   */
  async findSchedulesInHomesByOption(
    userId: number,
    option: GetHomeOptionEnum,
  ): Promise<IScheduleListInHomeOnToday[]> {
    switch (option) {
      case GetHomeOptionEnum.TODAY:
        return this.processingScheduleListWithArea(
          await this.scheduleRepository.selectScheduleListInHomeOnToday(userId),
        );
      // case GetHomeOptionEnum.AFTER:
      //   // result = await this.scheduleRepository.selectScheduleListInHomeOnAfter(
      //   //   userId,
      //   // );

      //   // return result;
      //   return;
      default:
        throw new BadRequestException(UserExceptionCode.GetHomeOptionErrorType);
    }
  }

  async processingScheduleListWithArea(
    result: IScheduleListInHomeOnToday[],
  ): Promise<IScheduleListInHomeOnToday[]> {
    return await Promise.all(
      result.map(async (r) => {
        const scheduleAreas =
          await this.scheduleAreaRepository.selectScheduleAreaListById(r.id);
        r.areas = scheduleAreas;
        return r;
      }),
    );
  }
}
