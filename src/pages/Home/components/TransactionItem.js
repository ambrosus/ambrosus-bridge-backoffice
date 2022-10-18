import React, {useContext, useEffect, useMemo, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import config from '../../../utils/bridge-config.json';
import {ambChainId, bscChainId, ethChainId} from '../../../utils/providers';
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
  const [transferredTokens, setTransferredTokens] = useState({
    from: '',
    to: '',
  });

  useEffect(async () => {
    const eventId = item.args.eventId;

    setTransferredTokens(handleTransferredTokens(item.args, tokens));

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

  const denomination = useMemo(() => {
    const tokenAddress = item.args.tokenFrom === '0x0000000000000000000000000000000000000000'
      ? item.args.tokenTo
      : item.args.tokenFrom;

    const currentToken = tokens.find((el) => el.address === tokenAddress);
    const networksIds = [+getDestinationNet(item.to, bridges), item.chainId];
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

  let explorerLink = `${explorer}address/`

  if (item.chainId === ambChainId) {
    explorerLink = `${explorer}addresses/`;
  }

  return (
    <>
      <TableRow
        key={item.transactionHash}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <a href={`${explorerLink}${item.from}`} target="_blank">
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
          {utils.formatUnits(item.args.amount, denomination)}
        </TableCell>
        <TableCell>
          {utils.formatUnits(item.args['transferFeeAmount'].add(item.args['bridgeFeeAmount']), 18)}
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
