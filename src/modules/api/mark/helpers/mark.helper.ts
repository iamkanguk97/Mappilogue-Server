import { Injectable } from '@nestjs/common';
import { MarkEntity } from '../entities/mark.entity';
import { StatusColumnEnum } from 'src/constants/enum';
import * as _ from 'lodash';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { MarkCategoryService } from '../../mark-category/services/mark-category.service';

@Injectable()
export class MarkHelper {
  constructor(
    private readonly scheduleService: ScheduleService, // private readonly markCategoryService: MarkCategoryService,
  ) {}

  isMarkExist(markStatus?: MarkEntity | undefined): boolean {
    return (
      !_.isNil(markStatus) && markStatus.status !== StatusColumnEnum.DELETED
    );
  }

  async setScheduleColorByCreateMark(userId: number, body: any): Promise<void> {
    if (!_.isNil(body?.scheduleId)) {
      const scheduleId = body.scheduleId;

      await this.scheduleService.checkScheduleStatus(userId, scheduleId);
      await this.scheduleService.modifyById(scheduleId, {
        colorId: body.colorId,
      });
    }
  }

  // async isValidMarkCategoryByCreateMark(
  //   userId: number,
  //   markCategoryId?: number | undefined,
  // ): Promise<void> {
  //   if (!_.isNil(markCategoryId)) {
  //     await this.markCategoryService.checkMarkCategoryStatus(
  //       userId,
  //       markCategoryId,
  //     );
  //   }
  // }
}
