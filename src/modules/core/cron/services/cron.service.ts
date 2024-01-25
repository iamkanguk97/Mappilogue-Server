import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  /**
   * @summary 어제의 회원탈퇴 유저들 파악 후 관련 데이터 삭제처리
   * @author  Jason
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  handleWithdrawUser() {
    // CRON이 돌아가는 시점의 어제 날짜를 가져옴
    // 어제 날짜에 회원탈퇴를 한 유저들 리스트를 가져옴
    // 가져와서 한번에 삭제처리 하기
  }
}
