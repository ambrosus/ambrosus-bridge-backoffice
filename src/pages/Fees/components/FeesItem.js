import React, {useEffect, useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import {BigNumber, utils} from 'ethers';
import getTxLastStageStatus from '../../../utils/getTxLastStageStatus';
import providers, {ambChainId, ethChainId} from '../../../utils/providers';

const FeesItem = ({ item, handleSelectedTxs, isOpen, chainId, ambPrice }) => {
  const [isSuccess, setIsSuccess] = useState(true);
  const [ethFee, setEthFee] = useState(0);

  useEffect(async () => {
    const lastEvent = await getTxLastStageStatus(chainId, item.eventId);

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
      return totalBalance.add(el.args.transferFeeAmount).add(el.args.bridgeFeeAmount);
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
