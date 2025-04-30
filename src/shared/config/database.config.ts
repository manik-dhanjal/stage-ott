import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { MongooseOptionsFactory } from '@nestjs/mongoose';

export interface DatabaseConfig {
  uri: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  config: MongooseOptionsFactory;
}

export const DATABASE_CONFIG_NAME = 'database-config';

export const databaseConfig = registerAs(DATABASE_CONFIG_NAME, () => {
  const dbUrlValidation = Joi.string().uri().required();
  const dbUrl = dbUrlValidation.validate(process.env.DB_URL).value;
  const mongoLoggerLevelValidation = Joi.string().default('info');
  const mongoLoggerLevel = mongoLoggerLevelValidation.validate(
    process.env.MONGO_LOGGER_LEVEL,
  ).value;
  return {
    uri: dbUrl,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    config: {
      autoIndex: false,
      loggerLevel: mongoLoggerLevel,
      toObject: {
        getters: true,
        virtuals: true,
        transform: true,
        flattenDecimals: true,
      },
      toJSON: {
        getters: true,
        virtuals: true,
        transform: true,
        flattenDecimals: true,
      },
    },
  };
});
