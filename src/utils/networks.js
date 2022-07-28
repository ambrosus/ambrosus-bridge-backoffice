import NetworksConfig from './networks.json';

const { REACT_APP_ENV } = process.env;

export const allNetworks = NetworksConfig[REACT_APP_ENV];

const { amb, eth, bsc } = allNetworks;

export const supportedNetworks = [eth, bsc];
export const AmbrosusNetwork = amb;

export const getNetworkByChainId = (chainId) =>
  Object.values(allNetworks).find((network) => network.chainId === chainId);

export const networksChainIds = Object.values(allNetworks).map(
  (network) => network.chainId,
);
