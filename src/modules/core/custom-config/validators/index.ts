import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

export const CUSTOM_CONFIG_VALIDATOR: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'test' ? '.env' : '../../../../.env',
  validationOptions: Joi.object({
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().required(),
    ACCESS_SECRET_KEY: Joi.string().required(),
    REFRESH_SECRET_KEY: Joi.string().required(),
    EMAIL_CRYPT_SECRET_KEY: Joi.string().required(),
    EMAIL_CRYPT_ALGORITHM: Joi.string().required(),
  }),
};
