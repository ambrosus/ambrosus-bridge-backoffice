import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from './providers';

export const ambContractAddress = '0x63B825C40a78e2e9A7aeaC83027215A022b37B93';
export const ethContractAddress = '0xc4A53948cf9bEd15177fa4A8EadA035C867Be05e';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
