import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from './providers';

export const ambContractAddress = '0xE776102fc41CA89C7D7aA9ee17d805EBfCa39216';
export const ethContractAddress = '0xdAe415A6f4256e87ad214d339915832F395667e4';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
