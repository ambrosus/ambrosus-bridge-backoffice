import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import {BigNumber, utils} from 'ethers';
import getTxLastStageStatus from '../../../utils/getTxLastStageStatus';
import providers, {ambChainId, ethChainId} from '../../../utils/providers';
import {getDestinationNet} from '../../../utils/getDestinationNet';
import ConfigContext from '../../../context/ConfigContext/context';
import {getNetFromAddress} from '../../../utils/getNetFromAddress';

const FeesItem = ({ item, handleSelectedTxs, isOpen, contractAddress, ambPrice }) => {
  const { bridges } = useContext(ConfigContext);
  const [isSuccess, setIsSuccess] = useState(true);
  const [ethFee, setEthFee] = useState(0);

  useEffect(async () => {
    const destNetId = +getDestinationNet(contractAddress, bridges);
    const chainId = getNetFromAddress(contractAddress, bridges);
    const otherContractAddress = Object.values(
      bridges[
        destNetId === ambChainId
          ? chainId
          : destNetId
        ],
    ).find((el) => el !== contractAddress);

    const lastEvent = await getTxLastStageStatus(destNetId, item.eventId, otherContractAddress);

    if (lastEvent[0]) {
      const txHash = lastEvent[0].transactionHash;
      const txReceipt =
        await providers[chainId === ambChainId ? ethChainId : ambChainId]
          .getTransactionReceipt(txHash);

      setEthFee(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice))
    } else {
      setIsSuccess(false);
    }
  }, []);

  const currentFee = useMemo(() => {
    return item.txs.reduce((totalBalance, el) => {
      return totalBalance.add(el.args.transferFeeAmount);
    }, BigNumber.from(0));
  }, [item]);

  const handleTxOpen = () => handleSelectedTxs(item);

  return (
    <TableRow sx={{ background: isOpen ? '#e2e2e2' : 'white' }} onClick={handleTxOpen}>
      <TableCell>
        #{item.eventId}
      </TableCell>
      <TableCell>
        {utils.formatUnits(currentFee, 18)}
      </TableCell>
      <TableCell>
        {utils.formatUnits(ethFee, 18)}
      </TableCell>
      <TableCell>
        {isSuccess ? 'Success' : 'Pending'}
      </TableCell>
    </TableRow>
  )
};

export default FeesItem;
