import { UserProfileModule } from './user-profile/user-profile.module';
import { Global, Module } from '@nestjs/common';
import { ColorModule } from './color/color.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MarkCategoryModule } from './mark-category/mark-category.module';
import { MarkModule } from './mark/mark.module';
import { UserHomeModule } from './user-home/user-home.module';

@Global()
@Module({
  imports: [
    ColorModule,
    UserModule,
    UserProfileModule,
    UserHomeModule,
    ScheduleModule,
    MarkModule,
    MarkCategoryModule,
  ],
  exports: [
    ColorModule,
    UserModule,
    UserProfileModule,
    UserHomeModule,
    ScheduleModule,
    MarkModule,
    MarkCategoryModule,
  ],
})
export class ApiModule {}
