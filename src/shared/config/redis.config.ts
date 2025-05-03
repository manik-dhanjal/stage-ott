import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface RedisConfig {
  host: string;
  port: number;
  ttl: number;
}

export const REDIS_CONFIG_NAME = 'redis-config';

export const redisConfig = registerAs(REDIS_CONFIG_NAME, (): RedisConfig => {
  const host = Joi.string()
    .default('localhost')
    .validate(process.env.REDIS_HOST).value;

  const port = Joi.number()
    .default(6379)
    .validate(process.env.REDIS_PORT).value;

  const ttl = Joi.number().default(60).validate(process.env.REDIS_TTL).value;

  return {
    host,
    port,
    ttl,
  };
});
