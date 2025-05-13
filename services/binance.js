const axios = require('axios');
const crypto = require('crypto');

const binance = axios.create({
  baseURL: 'https://fapi.binance.com',
  timeout: 10000,
  headers: { 'X-MBX-APIKEY': process.env.BINANCE_API_KEY }
});

const signRequest = (params) => {
  const timestamp = Date.now();
  const query = Object.entries({ ...params, timestamp })
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  
  const signature = crypto
    .createHmac('sha256', process.env.BINANCE_API_SECRET)
    .update(query)
    .digest('hex');

  return { ...params, timestamp, signature };
};

module.exports = {
  // Public endpoints
  async getMarketData() {
    return binance.get('/fapi/v1/ticker/24hr');
  },

  // Private endpoints
  async createOrder(orderParams) {
    return binance.post('/fapi/v1/order', null, { 
      params: signRequest(orderParams) 
    });
  }
};
