import { IEnvConfiguration } from '@/env/env-configuration';

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface ProcessEnv {
      // Environment
      NODE_ENV: IEnvConfiguration.TEnvType;
      PORT: string;

      // Database
      DATABASE_URL: string;

      // Coin Gecko
      COIN_GECKO_API_KEY: string;

      // Authentication
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }
}