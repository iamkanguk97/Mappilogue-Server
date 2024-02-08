import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';
import { setFirebaseCredential } from 'src/helpers/firebase.helper';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  Notification,
  TokenMessage,
} from 'firebase-admin/lib/messaging/messaging-api';
import { DataSource } from 'typeorm';
import { UserAlarmHistoryEntity } from 'src/modules/api/user/entities/user-alarm-history.entity';

import * as firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.cert(setFirebaseCredential(__dirname)),
});

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  /**
   * @summary 푸시 메세지 발송
   * @author  Jason
   * @param   { TokenMessage } payload
   */
  async sendPushMessage(payload: TokenMessage): Promise<void> {
    await firebase.messaging().send(payload);
  }

  /**
   * @summary 일정 생성 푸시 알림 생성
   * @author  Jason
   * @param   { number } newScheduleId
   * @param   { number } userAlarmHistoryId
   * @param   { Notification } message
   * @param   { string } alarmTime
   * @param   { string } fcmToken
   */
  async sendPushForScheduleCreate(
    newScheduleId: number,
    userAlarmHistoryId: number,
    message: Notification,
    alarmTime: string,
    fcmToken: string,
  ): Promise<void> {
    const cronName = 'newScheduleId' + newScheduleId.toString();

    try {
      const messageSendTime = new Date(alarmTime);
      const payload = {
        notification: message,
        data: {
          scheduleId: newScheduleId.toString(),
        },
        token: fcmToken,
      } as TokenMessage;

      const sendMessageJob = new CronJob(messageSendTime, async () => {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          await Promise.all([
            this.sendPushMessage(payload),
            queryRunner.manager.getRepository(UserAlarmHistoryEntity).update(
              { id: userAlarmHistoryId },
              {
                isSent: CheckColumnEnum.ACTIVE,
                alarmAt: () => 'CURRENT_TIMESTAMP',
              },
            ),
          ]);

          await queryRunner.commitTransaction();
          return;
        } catch (err) {
          this.logger.error(
            `[sendPushForScheduleCreate - sendMessageJob] ${err}`,
          );
          await queryRunner.rollbackTransaction();
        } finally {
          await queryRunner.release();
        }
      });

      this.scheduleRegistry.addCronJob(cronName, sendMessageJob);
      sendMessageJob.start();
    } catch (err) {
      this.logger.error(`[sendPushForScheduleCreate] ${err}`);
      throw new InternalServerErrorException(
        InternalServerExceptionCode.NotificationSchedulerError,
      );
    }
  }
}
