import { UserProfileModule } from './user-profile/user-profile.module';
import { Global, Module } from '@nestjs/common';
import { ColorModule } from './color/color.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [ColorModule, UserModule, UserProfileModule],
  exports: [ColorModule, UserModule, UserProfileModule],
})
export class ApiModule {}
