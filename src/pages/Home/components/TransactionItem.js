import React, {useEffect, useState} from 'react';
import {TableCell, TableRow} from '@mui/material';
import config from '../../../utils/bridge-config.json';
import providers, {ambChainId, ethChainId} from '../../../utils/providers';
import createBridgeContract from '../../../utils/contracts';
import getTxLastStageStatus from '../../../utils/getTxLastStageStatus';
import getEventSignatureByName from '../../../utils/getEventSignatureByName';
import {getAllNetworks} from '../../../utils/networks';
import { utils, BigNumber } from 'ethers';
import Status from './Status';

const TransactionItem = ({item}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);
  const [currentToken, setCurrentToken] = useState({});
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenName, setTokenName] = useState('');

  useEffect(async () => {
    const transferData = await getEventData('Transfer');

    const eventId = item.args.eventId;
    const tokenAddress = item.args['tokenFrom'];

    if (transferData) {
      const correctTransfer = transferData.args.queue.find(
        (el) => el.toAddress === item.from,
      );
      setTokenAmount(correctTransfer.amount);
    }

    if (BigNumber.from(0).eq(tokenAddress)) {
      setTokenName(item.chainId === ambChainId ? 'AMB' : 'ETH');
    } else {
      setTokenName(findTokenByAddress(withDrawArgs.tokenFrom));
    }

    const currentCoin = Object.values(config.tokens).find((token) =>
      Object.values(token.addresses).some((el) => el && el === tokenAddress),
    );

    if (currentCoin) {
      setCurrentToken(currentCoin);
    }

    const lastStage = await getTxLastStageStatus(item.chainId, eventId);
    setIsSuccess(lastStage.length);

    setDestinationNetTxHash(
      lastStage.length ? lastStage[0].transactionHash : '',
    );
  }, []);

  const findTokenByAddress = (address) => {
    let tokenName;

    Object.keys(tokens).forEach((el) => {
      Object.values(tokens[el].addresses).forEach((addr) => {
        if (addr === address) {
          tokenName = el;
        }
      });
    });
    return tokenName;
  };

  const getEventData = async (eventName) => {
    const receipt = await providers[item.chainId].getTransactionReceipt(item.hash);
    const contract = createBridgeContract[item.chainId](providers[item.chainId]);

    const eventData = receipt.logs.find((log) =>
      log.topics.some(
        (topic) => topic === getEventSignatureByName(contract, eventName),
      ),
    );
    if (eventData) {
      return contract.interface.parseLog(eventData);
    }
    return null;
  };

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

  const getNetworkName = (networkId) =>
    getAllNetworks().find((el) => el.chainId === networkId).name;

  const getTxLink = (isEth, hash) =>
    `${
      isEth
        ? 'https://ropsten.etherscan.io/tx/'
        : 'https://explorer.ambrosus.io/tx/'
    }${hash}`;

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
        <TableCell>{tokenName}</TableCell>
        <TableCell>
          <a href={getTxLink(item.chainId === ethChainId, item.hash)} target="_blank">
            {getNetworkName(item.chainId)} tx
          </a>
        </TableCell>
        <TableCell>
          {destinationNetTxHash ? (
            <a href={getTxLink(item.chainId !== ethChainId, destinationNetTxHash)} target="_blank">
              {getNetworkName(
                item.chainId === ambChainId ? ethChainId : ambChainId,
              )} tx
            </a>
          ) : (
            getNetworkName(
              item.chainId === ambChainId ? ethChainId : ambChainId,
            )
          )}
        </TableCell>
        <TableCell>
          {utils.formatUnits(tokenAmount, currentToken.denomination)}
        </TableCell>
        <TableCell>
          {utils.formatUnits(item.args['feeAmount'], currentToken.denomination)}
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
