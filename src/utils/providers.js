import { ethers } from 'ethers';
import { allNetworks } from './networks';
import CustomJsonRpcBatchProvider from './CustomJsonRpcBatchProvider';

const { REACT_APP_INFURA_KEY } = process.env;

// ethereum read-only provider configuration
export const ethChainId = allNetworks.eth.chainId;

const ethProvider = new ethers.providers.InfuraWebSocketProvider(
  ethChainId,
  REACT_APP_INFURA_KEY,
);

// eth custom batch provider for balance worker
const ethBatchProvider = new CustomJsonRpcBatchProvider(
  allNetworks.eth.rpcUrl + process.env.REACT_APP_INFURA_KEY,
  allNetworks.eth.chainId,
);

// ambrosus read-only provider configuration
export const ambChainId = allNetworks.amb.chainId;

export const ambProvider = new ethers.providers.StaticJsonRpcProvider(
  allNetworks.amb.rpcUrl,
  ambChainId,
);

// amb custom batch provider for balance worker
const ambBatchProvider = new CustomJsonRpcBatchProvider(
  allNetworks.amb.rpcUrl,
  allNetworks.amb.chainId,
);

// binance smart chain read-only provider configuration
export const bscChainId = allNetworks.bsc.chainId;

const bscProvider = new ethers.providers.StaticJsonRpcProvider(
  allNetworks.bsc.rpcUrl,
  bscChainId,
);

// bsc custom batch provider for balance worker
const bscBatchProvider = new CustomJsonRpcBatchProvider(
  allNetworks.bsc.rpcUrl,
  bscChainId,
);

const providers = {
  [ethChainId]: ethProvider,
  [ambChainId]: ambProvider,
  [bscChainId]: bscProvider,
};

export const batchProviders = {
  [ethChainId]: ethBatchProvider,
  [ambChainId]: ambBatchProvider,
  [bscChainId]: bscBatchProvider,
};

export default providers;
