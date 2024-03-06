import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  Notification,
  TokenMessage,
} from 'firebase-admin/lib/messaging/messaging-api';
import { UserAlarmHistoryRepository } from 'src/modules/api/user/repositories/user-alarm-history.repository';

import * as firebase from 'firebase-admin';
import { setFirebaseCredential } from 'src/helpers/firebase.helper';

firebase.initializeApp({
  credential: firebase.credential.cert(setFirebaseCredential(__dirname)),
});

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly scheduleRegistry: SchedulerRegistry,
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
  ) {}

  /**
   * @summary 일정 알림 CronJob 이름 생성
   * @author  Jason
   * @param   { number } scheduleId
   * @param   { number } alarmHistoryId
   * @returns { string }
   */
  setScheduleNotificationCronName(
    scheduleId: number,
    alarmHistoryId: number,
  ): string {
    return `scheduleId${scheduleId.toString()}/alarmId${alarmHistoryId.toString()}`;
  }

  /**
   * @summary 일정 알림 CronJob Payload 생성
   * @author  Jason
   * @param   { Notification } message
   * @param   { number } scheduleId
   * @param   { string } fcmToken
   * @returns { TokenMessage }
   */
  setScheduleNotificationPayload(
    message: Notification,
    scheduleId: number,
    fcmToken: string,
  ): TokenMessage {
    return {
      notification: message,
      data: {
        scheduleId: scheduleId.toString(),
        title: message.title,
        body: message.body,
      },
      token: fcmToken,
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            title: message.title,
            body: message.body,
          },
        },
      },
    } as TokenMessage;
  }

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
  ): Promise<string> {
    const cronName = this.setScheduleNotificationCronName(
      newScheduleId,
      userAlarmHistoryId,
    );

    try {
      const messageSendTime = new Date(alarmTime);
      const payload = this.setScheduleNotificationPayload(
        message,
        newScheduleId,
        fcmToken,
      );

      const sendMessageJob = new CronJob(
        messageSendTime,
        async () => {
          await this.sendPushMessage(payload);
          await this.userAlarmHistoryRepository.update(
            { id: userAlarmHistoryId },
            {
              isSent: CheckColumnEnum.ACTIVE,
              alarmAt: () => 'CURRENT_TIMESTAMP',
            },
          );
        },
        null,
        true,
        'Asia/Seoul',
      );
      this.scheduleRegistry.addCronJob(cronName, sendMessageJob);

      return cronName;
    } catch (err) {
      this.logger.error(`[sendPushForScheduleCreate] ${err}`);
      throw new InternalServerErrorException(
        InternalServerExceptionCode.NotificationSchedulerError,
      );
    }
  }
}
