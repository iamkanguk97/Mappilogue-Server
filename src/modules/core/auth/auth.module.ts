import { CustomCacheModule } from './../custom-cache/custom-cache.module';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CustomHttpModule } from '../http/custom-http.module';
import { AuthHelper } from './helpers/auth.helper';
import { JWKS_CLIENT_TOKEN, JWKS_URI } from './constants/auth.constant';
import * as jwksClient from 'jwks-rsa';
import { JwtHelper } from './helpers/jwt.helper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    CustomHttpModule,
    CustomCacheModule,
  ],
  providers: [
    AuthService,
    AuthHelper,
    JwtHelper,
    {
      provide: JWKS_CLIENT_TOKEN,
      useValue: jwksClient({
        jwksUri: JWKS_URI,
      }),
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
