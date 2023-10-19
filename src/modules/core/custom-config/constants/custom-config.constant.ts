export const DATABASE_KEY = {
  DATABASE_HOST: 'DATABASE_HOST',
  DATABASE_PORT: 'DATABASE_PORT',
  DATABASE_USERNAME: 'DATABASE_USERNAME',
  DATABASE_PASSWORD: 'DATABASE_PASSWORD',
  DATABASE_NAME: 'DATABASE_NAME',
} as const;

export const REDIS_KEY = {
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
  REDIS_PASSWORD: 'REDIS_PASSWORD',
} as const;

export const JWT_KEY = {
  ACCESS_SECRET_KEY: 'ACCESS_SECRET_KEY',
  REFRESH_SECRET_KEY: 'REFRESH_SECRET_KEY',
} as const;

export const EMAIL_CRYPT_KEY = {
  EMAIL_CRYPT_SECRET_KEY: 'EMAIL_CRYPT_SECRET_KEY',
  EMAIL_CRYPT_ALGORITHM: 'EMAIL_CRYPT_ALGORITHM',
} as const;

export const AWS_KEY = {
  AWS_S3_ACCESS_KEY: 'AWS_S3_ACCESS_KEY',
  AWS_S3_SECRET_KEY: 'AWS_S3_SECRET_KEY',
  AWS_S3_BUCKET_REGION: 'AWS_S3_BUCKET_REGION',
  AWS_S3_BUCKET_NAME: 'AWS_S3_BUCKET_NAME',
} as const;

export const ENVIRONMENT_KEY = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  ...DATABASE_KEY,
  ...REDIS_KEY,
  ...JWT_KEY,
  ...EMAIL_CRYPT_KEY,
  ...AWS_KEY,
} as const;
