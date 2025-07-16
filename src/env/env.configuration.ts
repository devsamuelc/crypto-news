/* eslint-disable @typescript-eslint/no-namespace */
export enum EEnvType {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
  LOCAL = 'local',
}

export declare namespace IEnvConfiguration {
  type TEnvType =
    (typeof EnvConfiguration.EnvType)[keyof typeof EnvConfiguration.EnvType];

  interface IProps {
    env: IEnvConfiguration.TEnvType;
    server: {
      port: number;
    };
    redis: {
      host: string;
      port: number;
    };
    database: {
      url: string;
    };
    coinGecko: {
      apiKey: string;
    };
    authentication: {
      secret: string;
      refreshSecret: string;
    };
  }
}

export class EnvConfiguration {
  private props: IEnvConfiguration.IProps;

  public static EnvType = EEnvType;
  private static instance: EnvConfiguration;

  private constructor() {
    this.props = {
      env: process.env.NODE_ENV,
      server: {
        port: Number(process.env.PORT),
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      authentication: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
      },
      coinGecko: {
        apiKey: process.env.COIN_GECKO_API_KEY,
      },
      database: {
        url: process.env.DATABASE_URL,
      },
    };
  }

  public static getInstance(): EnvConfiguration {
    if (!this.instance) {
      this.instance = new EnvConfiguration();
    }

    return this.instance;
  }

  public static initialize(): EnvConfiguration {
    if (!this.instance) {
      this.instance = new EnvConfiguration();
    }

    return this.instance;
  }

  public get authentication(): IEnvConfiguration.IProps['authentication'] {
    return this.props.authentication;
  }

  public get env(): IEnvConfiguration.IProps['env'] {
    return this.props.env;
  }

  public get redis(): IEnvConfiguration.IProps['redis'] {
    return this.props.redis;
  }

  public get database(): IEnvConfiguration.IProps['database'] {
    return this.props.database;
  }

  public get coinGecko(): IEnvConfiguration.IProps['coinGecko'] {
    return this.props.coinGecko;
  }

  public get server(): IEnvConfiguration.IProps['server'] {
    return this.props.server;
  }
}
