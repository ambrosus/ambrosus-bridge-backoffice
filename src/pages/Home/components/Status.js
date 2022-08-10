import React, {useContext, useState} from 'react';
import { createBridgeContract } from '../../../utils/contracts';
import providers, {ambChainId, ethChainId} from '../../../utils/providers';
import getEventSignatureByName from '../../../utils/getEventSignatureByName';
import {Button} from '@mui/material';
import ConfigContext from '../../../context/ConfigContext/context';
import {getDestinationNet} from '../../../utils/getDestinationNet';

const withDrawName = 'Withdraw';

const Status = ({ tx }) => {
  const { bridges } = useContext(ConfigContext);

  const [stage, setStage] = useState(1);
  const [isActive, setIsActive] = useState(false);

  const handleClick = async () => {
    let currentStage = stage;

    const receipt = await providers[tx.chainId].getTransactionReceipt(tx.hash);
    const contract = createBridgeContract(tx.to, providers[tx.chainId])

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

    const event = await getFirstEventFromContract(
      contract,
      filter,
      receipt.blockNumber,
    );

    if (+currentStage === 1 && event.length) {
      currentStage = 2;
    }
    const minSafetyBlock = await contract.minSafetyBlocks();
    const safetyBlockNumber = minSafetyBlock.toNumber();
    const confirmations = tx.confirmations > safetyBlockNumber ? safetyBlockNumber : tx.confirmations

    if (currentStage === 2 && confirmations === safetyBlockNumber) {
      currentStage = 3;
    }

    const destNetId = getDestinationNet(tx.to, bridges);
    const otherContractAddress = Object.values(
      bridges[
        tx.chainId !== ambChainId ? tx.chainId : destNetId
      ],
    ).find((el) => el !== tx.to);

    const otherNetworkContract = createBridgeContract(otherContractAddress, providers[destNetId]);

    const transferSubmitFilter =
      await otherNetworkContract.filters.TransferSubmit(eventId);

    const transferSubmitEvent = await getFirstEventFromContract(
      otherNetworkContract,
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
    <Button
      onClick={handleClick}
      sx={{ padding: '0', fontSize: '10px' }}
      size="small"
      variant="outlined"
    >
      Pending
    </Button>
  )
}

export default Status;
