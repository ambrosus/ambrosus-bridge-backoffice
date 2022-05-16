import { ethers } from 'ethers';

import ABI from './abi.json';

import { ambChainId, ethChainId } from './providers';

export const ambContractAddress = '0xA7CB71C94f3fC5Ee2232f8E449461177bc23527B';
export const ethContractAddress = '0x38eC3621e15a730c42a8094a62886CEA2E0aAEb4';

const createAmbBridgeContract = (provider) =>
  new ethers.Contract(ambContractAddress, ABI, provider);

const createEthBridgeContract = (provider) =>
  new ethers.Contract(ethContractAddress, ABI, provider);

const createBridgeContract = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContract;
