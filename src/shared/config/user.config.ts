import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import ms, { StringValue } from 'ms';

export interface UserConfig {
  jwtSecret: string;
  refreshJwtExpiresIn: number;
  accessJwtExpiresIn:  number;
  passwordSaltRounds: number;
}

export const USER_CONFIG_NAME = 'user-config';

export const userConfig = registerAs(USER_CONFIG_NAME, (): UserConfig => {
  const jwtSecret = Joi.string()
    .min(20)
    .required()
    .validate(process.env.USER_JWT_SECRET).value;
  const accessJwtExpiresIn = Joi.string()
    .required()
    .validate(process.env.USER_ACCESS_JWT_EXPIRES_IN).value as StringValue;
  const refreshJwtExpiresIn = Joi.string()
    .required()
    .validate(process.env.USER_REFRESH_JWT_EXPIRES_IN).value as StringValue;
  const passwordSaltRounds = Joi.number()
    .required()
    .validate(process.env.USER_PASSWORD_SALT_ROUNDS).value;
  return {
    jwtSecret,
    accessJwtExpiresIn: ms(accessJwtExpiresIn),
    refreshJwtExpiresIn: ms(refreshJwtExpiresIn),
    passwordSaltRounds,
  };
});
