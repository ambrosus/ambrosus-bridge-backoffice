import providers from './providers';
import { createBridgeContract } from './contracts';
import getFirstEventFromContract from './getFirstEventFromContract';

const getTxLastStageStatus = async (otherNetId, eventId, address) => {
  const otherProvider = providers[otherNetId];

  const otherNetworkContract = createBridgeContract(address, otherProvider);

  const otherNetworkFilter = await otherNetworkContract.filters.TransferFinish(
    eventId,
  );
  return getFirstEventFromContract(otherNetworkContract, otherNetworkFilter);
};

export default getTxLastStageStatus;
