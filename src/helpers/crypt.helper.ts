import { ConfigService } from '@nestjs/config';
import { CustomConfigService } from 'src/modules/core/custom-config/services';
import * as crypto from 'crypto';
import { ENVIRONMENT_KEY } from 'src/modules/core/custom-config/constants/custom-config.constant';

/**
 * @title 이메일 암호화 함수
 * @param email
 * @returns encryptedEmail
 */
export function encryptEmail(email: string): string {
  const customConfigService = new CustomConfigService(new ConfigService());
  const key = crypto
    .createHash('sha256')
    .update(
      customConfigService.get<string>(ENVIRONMENT_KEY.EMAIL_CRYPT_SECRET_KEY),
    )
    .digest('base64')
    .substring(0, 32);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    customConfigService.get<string>(ENVIRONMENT_KEY.EMAIL_CRYPT_ALGORITHM),
    key,
    iv,
  );

  let encrypted = cipher.update(email, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

/**
 * @title 이메일 복호화 함수
 * @param encryptEmail
 * @returns email
 */
export function decryptEmail(encryptedEmail: string): string {
  const customConfigService = new CustomConfigService(new ConfigService());
  const key = crypto
    .createHash('sha256')
    .update(
      customConfigService.get<string>(ENVIRONMENT_KEY.EMAIL_CRYPT_SECRET_KEY),
    )
    .digest('base64')
    .substring(0, 32);

  const iv = Buffer.from(encryptedEmail.slice(0, 32), 'hex');
  const encrypted = encryptedEmail.slice(32);
  const decipher = crypto.createDecipheriv(
    customConfigService.get<string>(ENVIRONMENT_KEY.EMAIL_CRYPT_ALGORITHM),
    key,
    iv,
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
