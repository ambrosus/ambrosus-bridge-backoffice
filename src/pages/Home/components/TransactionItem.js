import React, { useEffect, useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import {BigNumber, utils} from 'ethers';
import {allNetworks} from '../../../utils/networks';
import {ambChainId} from "../../../utils/providers";

const TransactionItem = ({item}) => {
  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);

  useEffect(async () => {
    setDestinationNetTxHash(
      item.status === 5 ? item.destinationTxHash : '',
    );
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear()}, ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };

  const getTxLink = (chainId, hash) => {
    const explorerLink = Object.values(allNetworks).find(
      (el) => el.chainId === chainId,
    );
    return explorerLink ? `${explorerLink.explorerUrl}tx/${hash}` : null;
  };

  const explorer = useMemo(() => Object.values(allNetworks).find(
    (el) => el.chainId === item.chainId,
  ).explorerUrl);

  let explorerLink = `${explorer}address/`;

  return (
    <>
      <TableRow
        key={item.transactionHash}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <a href={`${explorerLink}${item.userAddress}`} target="_blank">
            {item.userAddress}
          </a>
        </TableCell>
        <TableCell>
          <a href={getTxLink(item.chainId, item.withdrawTx.txHash)} target="_blank">
            {item.tokenFrom.name}
          </a>
          ->
          {destinationNetTxHash ? (
            <a href={getTxLink(item.destChainId, destinationNetTxHash)} target="_blank">
              {item.tokenTo.name}
            </a>
          ) : item.tokenTo.name}
        </TableCell>
        <TableCell>{item.eventId}</TableCell>
        <TableCell>
          {item.denominatedAmount}
        </TableCell>
        <TableCell>
          {utils.formatUnits(
            BigNumber.from(item.feeTransfer.toString())
              .add(BigNumber.from(item.feeBridge.toString())),
            18
          )}
        </TableCell>
        <TableCell>{formatDate(item.withdrawTx.txTimestamp)}</TableCell>
        <TableCell>
          {item.status}/5
        </TableCell>
      </TableRow>
    </>
  )
};

export default TransactionItem;
