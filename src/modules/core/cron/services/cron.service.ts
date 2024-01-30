import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserRepository } from 'src/modules/api/user/repositories/user.repository';
import { Between } from 'typeorm';

import * as moment from 'moment';

@Injectable()
export class CronService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly logger = new Logger(CronService.name);

  /**
   * @summary 어제의 회원탈퇴 유저들 파악 후 관련 데이터 삭제처리
   * @author  Jason
   *
   * @comment
   * - CRON이 돌아가는 시점의 어제 날짜를 가져옴
   * - 어제 날짜에 회원탈퇴를 한 유저들 리스트를 가져옴
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async handleWithdrawUser(): Promise<void> {
    this.logger.debug(
      '*** [CronService - handleWithdrawUser] 회원탈퇴 유저 처리 시작 ***',
    );

    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

    const deletedAtStart = new Date(`${yesterday}T00:00:00Z`);
    const deletedAtEnd = new Date(`${yesterday}T23:59:59Z`);

    const withdrawUsers = await this.userRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Between(deletedAtStart, deletedAtEnd),
      },
      relations: [
        'userAlarmSetting',
        'schedules',
        'schedules.scheduleAreas',
        'markCategories',
        'marks',
        'marks.markMetadata',
        'marks.markLocation',
      ],
    });
    await this.userRepository.softRemove(withdrawUsers);

    this.logger.debug(
      '*** [CronService - handleWithdrawUser] 회원탈퇴 유저 처리 종료 ***',
    );

    return;
  }
}
