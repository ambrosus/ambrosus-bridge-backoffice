import { bscChainId, bscProvider } from './providers';

const { REACT_APP_BSC_FROM_BLOCK, REACT_APP_BSC_LOGS_LIMIT } = process.env;

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
    startBlock + +REACT_APP_BSC_LOGS_LIMIT < endBlock ? startBlock + +REACT_APP_BSC_LOGS_LIMIT : endBlock,
  );
  return recursiveQueryFilter(contract, filter, startBlock + +REACT_APP_BSC_LOGS_LIMIT, endBlock, [
    ...lastResult,
    ...result,
  ]);
};
