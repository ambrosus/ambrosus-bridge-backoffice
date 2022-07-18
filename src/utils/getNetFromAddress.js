import { ambChainId } from './providers';

export const getNetFromAddress = (contractAddress, bridges) => {
  let chainId;

  if (bridges) {
    Object.keys(bridges).forEach((id) => {
      Object.keys(bridges[id]).forEach((type) => {
        if (contractAddress === bridges[id][type]) {
          chainId = type === 'foreign' ? id : ambChainId;
        }
      });
    });
  }

  return chainId;
};
