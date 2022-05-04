import React, {useState} from 'react';
import createBridgeContract from '../../../utils/contracts';
import providers, {ambChainId, ethChainId} from '../../../utils/providers';
import getEventSignatureByName from '../../../utils/getEventSignatureByName';

const withDrawName = 'Withdraw';

const Status = ({ tx }) => {
  const [stage, setStage] = useState(1);
  const [isActive, setIsActive] = useState(false);

  const handleClick = async () => {
    let currentStage = stage;

    const receipt = await providers[tx.chainId].getTransactionReceipt(tx.hash);
    const contract = createBridgeContract[tx.chainId](providers[tx.chainId]);

    const withDrawEvent = receipt.logs.find((log) =>
      log.topics.some(
        (topic) =>
          topic === getEventSignatureByName(contract, withDrawName),
      ),
    );
    if (withDrawEvent) {
      currentStage = 1;
    }
    const eventId = contract.interface.parseLog(withDrawEvent).args.eventId;

    const filter = await contract.filters.Transfer(eventId);
    const event = await contract.queryFilter(filter);
    if (+currentStage === 1 && event.length) {
      currentStage = 2;
    }
    const minSafetyBlock = await contract.minSafetyBlocks();
    const safetyBlockNumber = minSafetyBlock.toNumber();
    const confirmations = tx.confirmations > safetyBlockNumber ? safetyBlockNumber : tx.confirmations

    if (currentStage === 2 && confirmations === safetyBlockNumber) {
      currentStage = 3;
    }
    const otherNetId = tx.chainId === ambChainId ? ethChainId : ambChainId;
    const otherProvider = providers[otherNetId];

    const otherNetworkContract =
      createBridgeContract[otherNetId](otherProvider);

    const transferSubmitFilter =
      await otherNetworkContract.filters.TransferSubmit(eventId);

    const transferSubmitEvent = await otherNetworkContract.queryFilter(
      transferSubmitFilter,
    );
    if (+currentStage === 3 && transferSubmitEvent.length) {
      currentStage = 4;
    }
    setStage(currentStage);
    setIsActive(true);
  };

  return isActive ? (
    <span>{stage}/5</span>
  ) : (
    <button onClick={handleClick}>Show stage</button>
  )
}

export default Status;
