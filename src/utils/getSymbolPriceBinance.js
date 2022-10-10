import React from 'react';
import axios from 'axios';

const binanceApiUrl = process.env.REACT_APP_BINANCE_API;

const getSymbolPriceBinance = async (option) => {
  const data = await axios.get(`${binanceApiUrl}/price`, { params: option });
};

export default getSymbolPriceBinance;
