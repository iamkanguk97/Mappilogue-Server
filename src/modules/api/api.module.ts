import { Global, Module } from '@nestjs/common';
import { ColorModule } from './color/color.module';
import { UserModule } from './user/modules/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MarkModule } from './mark/modules/mark.module';

@Global()
@Module({
  imports: [ColorModule, UserModule, ScheduleModule, MarkModule],
  exports: [ColorModule, UserModule, ScheduleModule, MarkModule],
})
export class ApiModule {}
