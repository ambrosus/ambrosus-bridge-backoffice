import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { BigNumber, utils } from 'ethers';
import getTxLastStageStatus from '../../../utils/getTxLastStageStatus';
import providers, { ambChainId, ethChainId } from '../../../utils/providers';
import { getDestinationNet } from '../../../utils/getDestinationNet';
import ConfigContext from '../../../context/ConfigContext/context';
import { getNetFromAddress } from '../../../utils/getNetFromAddress';
import formatAmount from '../../../utils/formatAmount';

const FeesItem = ({
  item,
  handleSelectedTxs,
  isOpen,
  contractAddress,
  usdValue,
}) => {
  const { bridges } = useContext(ConfigContext);
  const [isSuccess, setIsSuccess] = useState(true);
  const [otherFee, setOtherFee] = useState(0);

  useEffect(async () => {
    const destNetId = +getDestinationNet(contractAddress, bridges);
    const chainId = getNetFromAddress(contractAddress, bridges);

    const otherContractAddress = Object.values(
      bridges[destNetId === ambChainId ? chainId : destNetId],
    ).find((el) => el !== contractAddress);

    Promise.all([
      getTxLastStageStatus(destNetId, item.eventId, otherContractAddress),
      getTxLastStageStatus(
        destNetId,
        item.eventId,
        otherContractAddress,
        'TransferSubmit',
      ),
    ]).then(([finishEvent, submitEvent]) => {
      if (finishEvent[0]) {
        Promise.all([
          calculateDestNetTxFee(finishEvent[0], destNetId),
          calculateDestNetTxFee(submitEvent[0], destNetId),
        ]).then((response) => setOtherFee(response[0].add(response[1])));
      } else {
        setIsSuccess(false);
      }
    });
  }, []);

  const calculateDestNetTxFee = async (event, destNetId) => {
    const txHash = event.transactionHash;
    let sum = 0;

    await Promise.all([
      providers[destNetId].getTransactionReceipt(txHash),
      providers[destNetId].getTransaction(txHash),
    ]).then(([receipt, tx]) => (sum = receipt.gasUsed.mul(tx.gasPrice)));

    return sum;
  };

  const currentFee = useMemo(() => {
    return item.txs.reduce((totalBalance, el) => {
      return totalBalance.add(el.args.transferFeeAmount);
    }, BigNumber.from(0));
  }, [item]);

  const handleTxOpen = () => handleSelectedTxs(item);

  const leftUsd = useMemo(
    () =>
      (
        +formatAmount(utils.formatUnits(currentFee, 18)) * +usdValue.leftUsd
      ).toFixed(2),
    [usdValue.leftUsd],
  );

  const rightUsd = useMemo(
    () =>
      (
        +formatAmount(utils.formatUnits(otherFee, 18)) * +usdValue.rightUsd
      ).toFixed(2),
    [usdValue.rightUsd],
  );

  return (
    <TableRow
      sx={{ background: isOpen ? '#e2e2e2' : 'white' }}
      onClick={handleTxOpen}
    >
      <TableCell>#{item.eventId}</TableCell>
      <TableCell>
        {`${formatAmount(utils.formatUnits(currentFee, 18))} `}
        <span style={{ color: '#008000' }}>{`(${leftUsd}$)`}</span>
      </TableCell>
      <TableCell>
        {otherFee === 0 ? (
          'loading'
        ) : (
          <>
            {`${formatAmount(utils.formatUnits(otherFee, 18))}`}
            <span style={{ color: '#008000' }}>{` (${rightUsd}$)`}</span>
          </>
        )}
      </TableCell>
      <TableCell>{isSuccess ? 'Success' : 'Pending'}</TableCell>
    </TableRow>
  );
};

export default FeesItem;
