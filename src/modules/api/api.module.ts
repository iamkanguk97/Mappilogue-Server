import { Global, Module } from '@nestjs/common';
import { ColorModule } from './color/color.module';
import { UserModule } from './user/modules/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MarkModule } from './mark/modules/mark.module';
import { UserHomeModule } from './user-home/user-home.module';

@Global()
@Module({
  imports: [
    ColorModule,
    UserModule,
    UserHomeModule,
    ScheduleModule,
    MarkModule,
  ],
  exports: [
    ColorModule,
    UserModule,
    UserHomeModule,
    ScheduleModule,
    MarkModule,
  ],
})
export class ApiModule {}
