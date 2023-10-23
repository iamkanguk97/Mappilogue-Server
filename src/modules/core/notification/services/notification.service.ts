import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.cert('src/config/firebase-admin.json'),
});

@Injectable()
export class NotificationService {
  private readonly PUSH_TITLE_BY_SCHEDULE = '아직 타이틀 못정했어요..!';
  private readonly PUSH_BODY_BY_SCHEDULE = '아직 바디를 못정했어요..!';

  async isFcmTokenValid(fcmToken: string) {
    try {
      const decodedFcmToken = await firebase.auth().verifyIdToken(fcmToken);
      console.log(decodedFcmToken);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async sendPushForScheduleCreate(fcmToken: string, alarmTime: string) {
    return;
  }

  get pushTitleBySchedule() {
    return this.PUSH_TITLE_BY_SCHEDULE;
  }

  get pushBodyBySchedule() {
    return this.PUSH_BODY_BY_SCHEDULE;
  }
}
