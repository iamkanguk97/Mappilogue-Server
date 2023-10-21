import { Injectable } from '@nestjs/common';
import { PostScheduleRequestDto } from '../dtos/post-schedule-request.dto';

@Injectable()
export class ScheduleService {
  async create(userId: number, body: PostScheduleRequestDto) {
    return;
  }
}
