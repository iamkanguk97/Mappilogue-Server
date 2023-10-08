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

export const ENVIRONMENT_KEY = {
  NODE_ENV: 'NODE_ENV',
  ...DATABASE_KEY,
  ...REDIS_KEY,
} as const;
