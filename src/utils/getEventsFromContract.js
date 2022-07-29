import { bscChainId, bscProvider } from './providers';

const { REACT_APP_BSC_FROM_BLOCK } = process.env;

const getEventsFromContract = async (
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

export default getEventsFromContract;

const recursiveQueryFilter = async (
  contract,
  filter,
  startBlock,
  endBlock,
  lastResult = [],
) => {
  if (startBlock > endBlock) return lastResult;
  const result = await contract.queryFilter(
    filter,
    startBlock,
    startBlock + 49999 < endBlock ? startBlock + 49999 : endBlock,
  );
  return recursiveQueryFilter(contract, filter, startBlock + 49999, endBlock, [
    ...lastResult,
    ...result,
  ]);
};
