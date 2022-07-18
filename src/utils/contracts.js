import { ethers } from 'ethers';

import BridgeABI from './BridgeABI.json';
import TokenABI from './ERC20TokenABI.json';
import ConfigMock from './bridge-config.json';

import { ambChainId, ethChainId } from './providers';

export const ambContractAddress = ConfigMock.bridges.eth.amb;
export const ethContractAddress = ConfigMock.bridges.eth.side;

export const createBridgeContract = (contract, provider) =>
  new ethers.Contract(contract, BridgeABI, provider);

export const createTokenContract = (contract, provider) =>
  new ethers.Contract(contract, TokenABI, provider);

const createAmbBridgeContract = (provider) =>
  createBridgeContract(ambContractAddress, provider);

const createEthBridgeContract = (provider) =>
  createBridgeContract(ethContractAddress, provider);

const createBridgeContractById = {
  [ambChainId]: createAmbBridgeContract,
  [ethChainId]: createEthBridgeContract,
};

export default createBridgeContractById;
