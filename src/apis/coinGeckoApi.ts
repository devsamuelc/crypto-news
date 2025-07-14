import { EnvConfiguration } from '@/env/env.configuration';
import axios from 'axios';

const env = EnvConfiguration.getInstance();

export const CoinGeckoApi = () =>
  axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    headers: {
      'x-cg-api-key': env.coinGecko.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 10000,
  });
