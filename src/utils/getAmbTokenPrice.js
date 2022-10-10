import React from 'react';
import axios from 'axios';

const tokenApiUrl = process.env.REACT_APP_TOKEN_API_URL;

const getAmbTokenPrice = () =>
  axios.get(`${tokenApiUrl}/price`).then((res) => res.data.data);

export default getAmbTokenPrice;
