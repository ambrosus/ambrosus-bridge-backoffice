import React, {useContext, useEffect, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import config from '../../../utils/bridge-config.json';
import {ambChainId, ethChainId} from '../../../utils/providers';
import getTxLastStageStatus from '../../../utils/getTxLastStageStatus';
import { utils } from 'ethers';
import Status from './Status';
import handleTransferredTokens from '../../../utils/getTransferredTokens';
import ConfigContext from '../../../context/ConfigContext/context';
import {getDestinationNet} from '../../../utils/getDestinationNet';
import {allNetworks} from '../../../utils/networks';

const TransactionItem = ({item}) => {
  const { tokens, bridges } = useContext(ConfigContext);

  const [isSuccess, setIsSuccess] = useState(false);
  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);
  const [currentToken, setCurrentToken] = useState({});
  const [transferredTokens, setTransferredTokens] = useState({
    from: '',
    to: '',
  });

  useEffect(async () => {
    const eventId = item.args.eventId;
    const tokenAddress = item.args['tokenFrom'];

    setTransferredTokens(handleTransferredTokens(item.args, tokens));

    const currentCoin = Object.values(config.tokens).find((token) =>
      Object.values(token.addresses).some((el) => el && el === tokenAddress),
    );

    if (currentCoin) {
      setCurrentToken(currentCoin);
    }
    const destNetId = getDestinationNet(item.to, bridges);
    const otherContractAddress = Object.values(
      bridges[
        destNetId === ambChainId
          ? item.chainId
          : destNetId
        ],
    ).find((el) => el !== item.to);

    const lastStage = await getTxLastStageStatus(destNetId, eventId, otherContractAddress);
    setIsSuccess(lastStage.length);

    setDestinationNetTxHash(
      lastStage.length ? lastStage[0].transactionHash : '',
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

  return (
    <>
      <TableRow
        key={item.transactionHash}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <a href={`https://explorer.ambrosus.io/address/${item.from}`} target="_blank">
            {item.from}
          </a>
        </TableCell>
        <TableCell>
          <a href={getTxLink(item.chainId, item.hash)} target="_blank">
            {transferredTokens.from}
          </a>
          ->
          {destinationNetTxHash ? (
            <a href={getTxLink(+getDestinationNet(item.to, bridges), destinationNetTxHash)} target="_blank">
              {transferredTokens.to}
            </a>
          ) : transferredTokens.to}
        </TableCell>
        <TableCell>{item.args.eventId.toNumber()}</TableCell>
        <TableCell>
          {utils.formatUnits(item.args.amount, currentToken.denomination)}
        </TableCell>
        <TableCell>
          {utils.formatUnits(item.args['transferFeeAmount'].add(item.args['bridgeFeeAmount']), currentToken.denomination)}
        </TableCell>
        <TableCell>{formatDate(item.timestamp)}</TableCell>
        <TableCell>
          {isSuccess ? 'Success' : (
            <Status tx={item} />
          )}
        </TableCell>
      </TableRow>
    </>
  )
};

export default TransactionItem;
