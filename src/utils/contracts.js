import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from './providers';

export const ambContractAddress = '0x617F296c197266305904063CEFB07C9E3295D743';
export const ethContractAddress = '0xAd6557e9793F119e4d8601Eb5cB1b79b26d89fDb';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
