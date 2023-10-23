import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { ResponseEntity } from 'src/common/response-entity';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postSchedule(
    @UserId() userId: number,
    @Body() body: PostScheduleRequestDto,
  ): Promise<ResponseEntity<any>> {
    const result = await this.scheduleService.create(userId, body);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }
}
