import React, {useEffect, useState} from 'react';
import getTokenBalance from '../../utils/getTokenBalance';
import providers, {ambChainId, ethChainId} from '../../utils/providers';
import config from '../../utils/bridge-config.json';
import {ambContractAddress, ethContractAddress} from '../../utils/contracts';
import {utils} from 'ethers';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

const tableHeads = ['Token name', 'Ambrosus', 'Ethereum', 'Binance Smart Chain'];

const Balance = () => {
  const [balances, setBalances] = useState(null);

  useEffect(async () => {
    handleBalances();
  }, []);

  const handleBalances = async () => {
    const sambInEth = getTokenBalance(providers[ethChainId], config.tokens.SAMB.addresses.eth, ethContractAddress);
    const wethInEth = getTokenBalance(providers[ethChainId], config.tokens.WETH.addresses.eth, ethContractAddress);
    const sambInAmb = getTokenBalance(providers[ambChainId], config.tokens.SAMB.addresses.amb, ambContractAddress);
    const wethInAmb = getTokenBalance(providers[ambChainId], config.tokens.WETH.addresses.amb, ambContractAddress);

    const ethInEth = providers[ethChainId].getBalance(ethContractAddress);
    const ambInEth = providers[ethChainId].getBalance(ambContractAddress);
    const ethInAmb = providers[ambChainId].getBalance(ethContractAddress);
    const ambInAmb = providers[ambChainId].getBalance(ambContractAddress);

    Promise.all([sambInEth, wethInEth, sambInAmb, wethInAmb, ethInEth, ambInEth, ethInAmb, ambInAmb])
      .then((res) => {
        setBalances(res);
      })
  }

  return balances && (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {tableHeads.map((el) => (
                <TableCell key={el}>{el}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>AMB</TableCell>
              <TableCell>{utils.formatUnits(balances[7], 18)}</TableCell>
              <TableCell>{utils.formatUnits(balances[5], 18)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>sAMB</TableCell>
              <TableCell>{utils.formatUnits(balances[2], 18)}</TableCell>
              <TableCell>{utils.formatUnits(balances[0], 18)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ETH</TableCell>
              <TableCell>{utils.formatUnits(balances[6], 18)}</TableCell>
              <TableCell>{utils.formatUnits(balances[4], 18)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>wETH</TableCell>
              <TableCell>{utils.formatUnits(balances[3], 18)}</TableCell>
              <TableCell>{utils.formatUnits(balances[1], 18)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Balance;
