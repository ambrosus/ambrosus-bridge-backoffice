import React, {useContext, useEffect, useState} from 'react';
import getTokenBalance from '../../utils/getTokenBalance';
import providers, {ambChainId, bscChainId, ethChainId} from '../../utils/providers';
import {utils} from 'ethers';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import ConfigContext from '../../context/ConfigContext/context';
import formatValue from '../../utils/formatAmount';

const tableHeads = ['Token name', 'Ambrosus', 'Ethereum', 'Binance Smart Chain'];

const Balance = () => {
  const { bridges, tokens } = useContext(ConfigContext);

  const [balances, setBalances] = useState(null);

  useEffect(() => {
    handleBalances();
  }, []);

  const handleBalances = async () => {
    const sambInEth = getTokenBalance(providers[ethChainId], getTokenAddress('SAMB', ethChainId), bridges[ethChainId].foreign);
    const wethInEth = getTokenBalance(providers[ethChainId], getTokenAddress('WETH', ethChainId), bridges[ethChainId].foreign);
    const sambInAmb = getTokenBalance(providers[ambChainId], getTokenAddress('SAMB', ambChainId), bridges[ethChainId].native);
    const wethInAmb = getTokenBalance(providers[ambChainId], getTokenAddress('WETH', ambChainId), bridges[ethChainId].native);

    const sambInBnb = getTokenBalance(providers[bscChainId], getTokenAddress('SAMB', bscChainId), bridges[bscChainId].foreign);
    const wbnbInBnb = getTokenBalance(providers[bscChainId], getTokenAddress('WBNB', bscChainId), bridges[bscChainId].foreign);
    const wbnbInAmb = getTokenBalance(providers[ambChainId], getTokenAddress('WBNB', ambChainId), bridges[bscChainId].native);

    Promise.all([sambInEth, wethInEth, sambInAmb, wethInAmb, sambInBnb, wbnbInBnb, wbnbInAmb])
      .then((res) => {
        console.log(res);
        setBalances(res);
      });
  };

  const getTokenAddress = (symbol, chainId) => {
    return tokens.find((token) => token.symbol === symbol && token.chainId === chainId).address;
  };

  return balances && (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {tableHeads.map((el) => (
                <TableCell key={el}>{el}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>sAMB</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[2], 18))}</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[0], 18))}</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[4], 18))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>wETH</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[3], 18))}</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[1], 18))}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>wBNB</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[6], 18))}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{formatValue(utils.formatUnits(balances[5], 18))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Balance;
