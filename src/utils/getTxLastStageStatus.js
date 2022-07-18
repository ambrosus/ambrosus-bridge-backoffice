import providers from './providers';
import { createBridgeContract } from './contracts';

const getTxLastStageStatus = async (otherNetId, eventId, address) => {
  const otherProvider = providers[otherNetId];

  const otherNetworkContract = createBridgeContract(address, otherProvider);

  const otherNetworkFilter = await otherNetworkContract.filters.TransferFinish(
    eventId,
  );
  const otherNetworkEvent = await otherNetworkContract.queryFilter(
    otherNetworkFilter,
  );
  return otherNetworkEvent;
};

export default getTxLastStageStatus;
