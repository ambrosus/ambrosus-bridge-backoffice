import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import {bscChainId} from '../../../utils/providers';
import {BigNumber, utils} from 'ethers';
import handleTransferredTokens from '../../../utils/getTransferredTokens';
import ConfigContext from '../../../context/ConfigContext/context';
import {allNetworks} from '../../../utils/networks';

const TransactionItem = ({item}) => {
  const { tokens } = useContext(ConfigContext);

  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);
  const [transferredTokens, setTransferredTokens] = useState({
    from: '',
    to: '',
  });

  useEffect(async () => {
    setTransferredTokens(handleTransferredTokens({
      tokenTo: item.tokenTo,
      tokenFrom: item.tokenFrom
    }, tokens));

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

  const denomination = useMemo(() => {
    const tokenAddress = item.tokenFrom === '0x0000000000000000000000000000000000000000'
      ? item.tokenTo
      : item.tokenFrom;

    const currentToken = tokens.find((el) => el.address === tokenAddress);
    const networksIds = [item.destChainId, item.chainId];
    if (!currentToken) {
      return 18
    }
    if (networksIds.includes(bscChainId)) {
      return currentToken.decimals.bsc;
    } else {
      return currentToken.decimals.eth;
    }
  }, [item, tokens]);

  const explorer = useMemo(() => Object.values(allNetworks).find(
    (el) => el.chainId === item.chainId,
  ).explorerUrl);

  let explorerLink = `${explorer}addresses/`

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
            {transferredTokens.from}
          </a>
          ->
          {destinationNetTxHash ? (
            <a href={getTxLink(item.destChainId, destinationNetTxHash)} target="_blank">
              {transferredTokens.to}
            </a>
          ) : transferredTokens.to}
        </TableCell>
        <TableCell>{item.eventId}</TableCell>
        <TableCell>
          {!item.amount.toString().includes('+') && utils.formatUnits(item.amount.toString(), denomination)}
        </TableCell>
        <TableCell>
          {!item.feeTransfer.toString().includes('+') && !item.feeBridge.toString().includes('+') && utils.formatUnits(
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
