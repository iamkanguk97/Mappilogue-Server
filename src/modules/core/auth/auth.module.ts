import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CustomHttpModule } from '../http/custom-http.module';
import { AuthHelper } from './helpers/auth.helper';
import { JWKS_CLIENT_TOKEN, JWKS_URI } from './constants/auth.constant';
import * as jwksClient from 'jwks-rsa';

@Module({
  imports: [CustomHttpModule],
  providers: [
    AuthService,
    AuthHelper,
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
