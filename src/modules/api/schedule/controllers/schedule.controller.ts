import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';
import { ScheduleService } from '../services/schedule.service';
import { ResponseEntity } from 'src/common/response-entity';
import { ScheduleValidationPipe } from '../pipes/schedule-validation.pipe';
import { ScheduleDto } from '../dtos/schedule.dto';
import { PostScheduleResponseDto } from '../dtos/post-schedule-response.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async postSchedule(
    @UserId() userId: number,
    @Body() body: PostScheduleRequestDto,
  ): Promise<ResponseEntity<PostScheduleResponseDto>> {
    const result = await this.scheduleService.createSchedule(userId, body);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Delete('/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSchedule(
    @UserId() userId: number,
    @Param(ScheduleValidationPipe) schedule: ScheduleDto,
  ): Promise<void> {
    await this.scheduleService.removeSchedule(userId, schedule._id);
  }

  @Get('detail-by-date')
  @HttpCode(HttpStatus.OK)
  async getScheduleDetailByDate() {
    return;
  }
}
