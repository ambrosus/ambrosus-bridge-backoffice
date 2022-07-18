import { ambChainId } from './providers';

export const getDestinationNet = (contractAddress, bridges) => {
  let chainId;

  if (bridges) {
    Object.keys(bridges).forEach((id) => {
      Object.keys(bridges[id]).forEach((type) => {
        if (contractAddress === bridges[id][type]) {
          chainId = type === 'native' ? id : ambChainId;
        }
      });
    });
  }

  return chainId;
};
