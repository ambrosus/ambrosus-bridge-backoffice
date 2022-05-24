import React, {useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import {BigNumber, utils} from 'ethers';

const FeesItem = ({ item, handleSelectedTxs, isOpen }) => {
  console.log(1);
  const currentFee = useMemo(() => {
    return item.txs.reduce((totalBalance, el) => {
      return totalBalance.add(el.args.feeAmount);
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
        -
      </TableCell>
      <TableCell>
        -
      </TableCell>
    </TableRow>
  )
};

export default FeesItem;
