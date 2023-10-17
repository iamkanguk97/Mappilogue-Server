import { HttpService } from '@nestjs/axios';
import { AppleJwtTokenPayload, SocialFactoryInterface } from '../types';
import { UserSnsTypeEnum } from 'src/modules/api/user/constants/user.enum';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { APPLE_PUBLIC_KEY_URL } from '../constants/auth.constant';

export class SocialAppleFactory implements SocialFactoryInterface {
  private readonly httpService = new HttpService();
  private readonly snsType: UserSnsTypeEnum = UserSnsTypeEnum.APPLE;
  private readonly socialAccessToken: string;

  constructor(socialAccessToken: string) {
    this.socialAccessToken = socialAccessToken;
  }

  async validateSocialAccessToken(): Promise<string> {
    console.log(this.socialAccessToken);
    // const decodedAppleToken = jwt.decode(this.socialAccessToken, {
    //   complete: true,
    // }) as {
    //   header: { kid: string; alg: jwt.Algorithm };
    //   payload: { sub: string };
    // };
    const decodedAppleToken = jwt.decode(this.socialAccessToken, {
      complete: true,
    });
    console.log(decodedAppleToken);
    // const keyIdFromToken = decodedAppleToken.header.kid;

    // const jwksClient = new JwksClient({ jwksUri: APPLE_PUBLIC_KEY_URL });

    // const key = await jwksClient.getSigningKey(keyIdFromToken);
    // const publicKey = key.getPublicKey();

    // const verifiedDecodedToken = jwt.verify(this.socialAccessToken, publicKey, {
    //   algorithms: [decodedAppleToken.header.alg],
    // }) as AppleJwtTokenPayload;

    // console.log(verifiedDecodedToken);

    return '';
  }

  processingSocialInfo(appleInfo: any) {
    return;
  }

  getUserSocialInfo() {
    return;
  }
}
