import React from 'react';
import axios from 'axios';

const binanceApiUrl = process.env.REACT_APP_BINANCE_API;

const getSymbolPriceBinance = async (option) => {
  return await axios.get(`${binanceApiUrl}`, { params: option });
};

export default getSymbolPriceBinance;
