import { CustomCacheModule } from './../custom-cache/custom-cache.module';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CustomHttpModule } from '../http/custom-http.module';
import { JwtHelper } from './helpers/jwt.helper';
import { JwtModule } from '@nestjs/jwt';
import { CustomConfigModule } from '../custom-config/custom-config.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    CustomHttpModule,
    CustomCacheModule,
    CustomConfigModule,
  ],
  providers: [AuthService, JwtHelper],
  exports: [AuthService, JwtHelper],
})
export class AuthModule {}
