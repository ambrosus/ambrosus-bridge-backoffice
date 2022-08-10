import { bscChainId, bscProvider } from './providers';

const { REACT_APP_BSC_FROM_BLOCK } = process.env;

const getFirstEventFromContract = async (
  contract,
  filter,
  fromBlock = +REACT_APP_BSC_FROM_BLOCK,
) => {
  // eslint-disable-next-line no-underscore-dangle
  const { chainId } = contract.provider._network;
  if (chainId === bscChainId) {
    const latestBlock = await bscProvider.getBlockNumber();
    return recursiveQueryFilter(contract, filter, fromBlock, latestBlock);
  }
  return contract.queryFilter(filter);
};

export default getFirstEventFromContract;

const recursiveQueryFilter = async (contract, filter, startBlock, endBlock) => {
  if (startBlock > endBlock) return [];
  const result = await contract.queryFilter(
    filter,
    startBlock,
    startBlock + 49999 < endBlock ? startBlock + 49999 : endBlock,
  );
  if (result.length) return result;
  return recursiveQueryFilter(contract, filter, startBlock + 49999, endBlock);
};
