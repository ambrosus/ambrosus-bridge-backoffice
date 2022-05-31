import { ethers } from 'ethers';

import ABI from './abi.json';
import Config from './bridge-config.json';

import { ambChainId, ethChainId } from './providers';

export const ambContractAddress = Config.bridges.eth.amb;
export const ethContractAddress = Config.bridges.eth.side;

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
