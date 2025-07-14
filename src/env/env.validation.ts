import { z } from 'zod';
import { EnvConfiguration } from './env.configuration';

export class EnvValidation {
  public static validate() {
    return {
      validate: (config: Record<string, unknown>) => {
        const envSchema = z.object({
          // Environment
          NODE_ENV: z.enum([
            EnvConfiguration.EnvType.PRODUCTION,
            EnvConfiguration.EnvType.DEVELOPMENT,
            EnvConfiguration.EnvType.TEST,
            EnvConfiguration.EnvType.LOCAL,
          ]),
          PORT: z.string().transform(value => Number(value)),

          // Authentication
          JWT_SECRET: z.string(),
          JWT_REFRESH_SECRET: z.string(),

          // Database
          DATABASE_URL: z.string(),

          // Coin Gecko
          COIN_GECKO_API_KEY: z.string(),
        });

        const result = envSchema.safeParse(config);

        if (!result.success) {
          throw result.error;
        }

        return {
          value: result.data,
        };
      },
    };
  }
}