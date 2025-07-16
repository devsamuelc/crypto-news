import { IEnvConfiguration } from '@/env/env-configuration';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Environment
      NODE_ENV: IEnvConfiguration.TEnvType;
      PORT: string;

      // Database
      DATABASE_URL: string;

      // Redis
      REDIS_HOST: string;
      REDIS_PORT: string;

      // Coin Gecko
      COIN_GECKO_API_KEY: string;

      // Authentication
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }
}
