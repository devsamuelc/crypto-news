import axios from 'axios';

export const CoinGeckoApi = (cryptoApiKey: string) =>
  axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    headers: {
      'x-cg-api-key': cryptoApiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 10000,
  });
