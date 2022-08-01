import providers from './providers';
import { createBridgeContract } from './contracts';
import getFirstEventFromContract from './getFirstEventFromContract';

const getTxLastStageStatus = async (otherNetId, eventId, address, eventName = 'TransferFinish') => {
  const otherProvider = providers[otherNetId];

  const otherNetworkContract = createBridgeContract(address, otherProvider);

  const otherNetworkFilter = await otherNetworkContract.filters[eventName](
    eventId,
  );
  return getFirstEventFromContract(otherNetworkContract, otherNetworkFilter);
};

export default getTxLastStageStatus;
