import { ethers } from 'ethers';

const {
  REACT_APP_ETH_CHAIN_ID,
  REACT_APP_AMB_CHAIN_ID,
  REACT_APP_INFURA_KEY,
  REACT_APP_AMB_RPC_URL,
  REACT_APP_ETH_WS_RPC_URL,
} = process.env;

// ethereum read-only provider configuration
export const ethChainId = +REACT_APP_ETH_CHAIN_ID;

const ethProvider = new ethers.providers.WebSocketProvider(
    REACT_APP_ETH_WS_RPC_URL + REACT_APP_INFURA_KEY,
    ethChainId,
);

// ambrosus read-only provider configuration
export const ambChainId = +REACT_APP_AMB_CHAIN_ID;

export const ambProvider = new ethers.providers.StaticJsonRpcProvider(
    REACT_APP_AMB_RPC_URL,
    ambChainId,
);

const providers = {
  [ethChainId]: ethProvider,
  [ambChainId]: ambProvider,
};

export default providers;
