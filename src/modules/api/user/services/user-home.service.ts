import { BadRequestException, Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dtos/pagination/page-options.dto';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { ResultWithPageDto } from 'src/common/dtos/pagination/result-with-page.dto';
import { MarkRepository } from '../../mark/repositories/mark.repository';
import { EGetHomeOption } from '../constants/enums/user-home.enum';
import { GetHomeResponseDto } from '../dtos/response/get-home-response.dto';
import { ScheduleRepository } from '../../schedule/repositories/schedule.repository';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { ScheduleAreaRepository } from '../../schedule/repositories/schedule-area.repository';
import { IScheduleListInHomeOnToday } from '../../schedule/types';
import { IMarkListInHome } from '../../mark/interfaces';

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
    const result = await this.announcementRepository.selectAnnouncements(
      pageOptionsDto,
    );
    return ResultWithPageDto.from(result.data, result.meta);
  }

  /**
   * @summary 홈화면 조회 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { EGetHomeOption } option
   * @returns { Promise<GetHomeResponseDto> }
   */
  async findHomes(
    userId: number,
    option: EGetHomeOption,
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
   * @param   { EGetHomeOption } option
   * @returns { Promise<IScheduleListInHomeOnToday[]> }
   */
  async findSchedulesInHomesByOption(
    userId: number,
    option: EGetHomeOption,
  ): Promise<IScheduleListInHomeOnToday[]> {
    switch (option) {
      case EGetHomeOption.TODAY:
        return this.processingScheduleListWithArea(
          await this.scheduleRepository.selectScheduleListInHomeOnToday(userId),
        );
      case EGetHomeOption.AFTER:
        return await this.scheduleRepository.selectScheduleListInHomeOnAfter(
          userId,
        );
      default:
        throw new BadRequestException(UserExceptionCode.GetHomeOptionErrorType);
    }
  }

  /**
   * @summary 홈화면 조회 API Service -> 오늘의 일정 -> 각 일정에 해당하는 지역 가져오기
   * @author  Jason
   * @param   { IScheduleListInHomeOnToday[] } result
   * @returns { Promise<IScheduleListInHomeOnToday[]> }
   */
  async processingScheduleListWithArea(
    result: IScheduleListInHomeOnToday[],
  ): Promise<IScheduleListInHomeOnToday[]> {
    return await Promise.all(
      result.map(async (r) => {
        r.areas = await this.scheduleAreaRepository.selectScheduleAreaListById(
          r.id,
        );
        return r;
      }),
    );
  }
}
