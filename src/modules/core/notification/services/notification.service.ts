import { UserAlarmHistoryRepository } from './../../../api/user/repositories/user-alarm-history.repository';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import { CheckColumnEnum } from 'src/constants/enum';
import { setFirebaseCredential } from 'src/helpers/firebase.helper';

import * as firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.cert(setFirebaseCredential(__dirname)),
});

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly userAlarmHistoryRepository: UserAlarmHistoryRepository,
  ) {}

  async sendPushMessage(
    title: string,
    body: string,
    fcmToken: string,
  ): Promise<void> {
    await firebase.messaging().send({
      notification: { title, body },
      token: fcmToken,
      android: { priority: 'high' },
    });
  }

  async sendPushForScheduleCreate(
    userAlarmHistoryId: number,
    title: string,
    body: string,
    fcmToken: string,
    alarmTime: string,
  ): Promise<void> {
    try {
      const messageSendTime = new Date(alarmTime);
      const sendMessageJob = new CronJob(
        messageSendTime,
        async () => {
          try {
            await Promise.all([
              this.sendPushMessage(title, body, fcmToken),
              this.userAlarmHistoryRepository.update(
                { id: userAlarmHistoryId },
                {
                  isSent: CheckColumnEnum.ACTIVE,
                  alarmAt: () => 'CURRENT_TIMESTAMP',
                },
              ),
            ]);
          } catch (err) {
            this.logger.error(
              `[sendPushForScheduleCreate - sendMessageJob] ${err}`,
            );
          }
        },
        null,
        true,
      );
      sendMessageJob.start();
    } catch (err) {
      this.logger.error(`[sendPushForScheduleCreate] ${err}`);
      throw new InternalServerErrorException(
        InternalServerExceptionCode.NotificationSchedulerError,
      );
    }
  }
}
