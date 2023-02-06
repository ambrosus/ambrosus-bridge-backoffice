import React, { useContext, useEffect, useState } from 'react';
import providers, {
  ambChainId,
  bscChainId,
  ethChainId,
} from '../../utils/providers';
import {ethers, utils} from 'ethers';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ConfigContext from '../../context/ConfigContext/context';
import formatValue from '../../utils/formatAmount';
import ABI from '../../utils/balanceAbi.json';

const tableHeads = [
  '',
  'AMB (ETH)',
  'AMB (BSC)',
  'ETH',
  'BSC',
];

const Balance = () => {
  const { bridges, tokens } = useContext(ConfigContext);

  const [balances, setBalances] = useState(null);

  useEffect(() => {
    handleBalances();
  }, []);

  const handleBalances = async () => {
    const sAMBOnAMB = new ethers.Contract(getTokenAddress('SAMB', ambChainId), ABI, providers[ambChainId]);
    const sAMBOnETHLocked = sAMBOnAMB.balanceOf(bridges[ethChainId].native);
    const sAMBOnBSCLocked = sAMBOnAMB.balanceOf(bridges[bscChainId].native);
    const sAMBOnETH = new ethers.Contract(getTokenAddress('SAMB', ethChainId), ABI, providers[ethChainId]);
    const sAMBOnBSC = new ethers.Contract(getTokenAddress('SAMB', bscChainId), ABI, providers[bscChainId]);
    const sAMBOnETHSupplied = sAMBOnETH.totalSupply();
    const sAMBOnBSCSupplied = sAMBOnBSC.totalSupply();

    const USDCOnETH = new ethers.Contract(getTokenAddress('USDC', ethChainId), ABI, providers[ethChainId]);
    const USDCOnEthLocked = USDCOnETH.balanceOf(bridges[ethChainId].foreign);
    const USDCOnBSC = new ethers.Contract(getTokenAddress('USDC', bscChainId), ABI, providers[bscChainId]);
    const USDCOnBSCLocked = USDCOnBSC.balanceOf(bridges[bscChainId].foreign);
    const USDCOnAMB = new ethers.Contract(getTokenAddress('USDC', ambChainId), ABI, providers[ambChainId]);
    const USDCOnAMBETHThinkLocked = USDCOnAMB.bridgeBalances(bridges[ethChainId].native);
    const USDCOnAMBBSCThinkLocked = USDCOnAMB.bridgeBalances(bridges[bscChainId].native);


    const BUSDOnETH = new ethers.Contract(getTokenAddress('BUSD', bscChainId), ABI, providers[bscChainId]);
    const BUSDOnEthLocked = BUSDOnETH.balanceOf(bridges[bscChainId].foreign);
    // const BUSDOnBSC = new ethers.Contract(getTokenAddress('USDC', bscChainId), ABI, providers[bscChainId]);
    // const BUSDOnBSCLocked = USDCOnBSC.balanceOf(bridges[bscChainId].foreign);
    const BUSDOnAMB = new ethers.Contract(getTokenAddress('BUSD', ambChainId), ABI, providers[ambChainId]);
    // const BUSDOnAMBETHThinkLocked = USDCOnAMB.bridgeBalances(bridges[ethChainId].native);
    const BUSDOnAMBBSCThinkLocked = BUSDOnAMB.bridgeBalances(bridges[bscChainId].native);

    Promise.all([
      sAMBOnETHLocked,
      sAMBOnBSCLocked,
      sAMBOnETHSupplied,
      sAMBOnBSCSupplied,
      USDCOnEthLocked,
      USDCOnBSCLocked,
      USDCOnAMBETHThinkLocked,
      USDCOnAMBBSCThinkLocked,
      BUSDOnEthLocked,
      BUSDOnAMBBSCThinkLocked,
    ]).then((res) => {
      setBalances(res);
    });
  };

  const getTokenAddress = (symbol, chainId) => {
    return tokens.find(
        (token) => token.symbol === symbol && token.chainId === chainId,
    )?.address;
  };

  return (
      balances && (
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
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[0], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[2], 18))}
                    </TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[1], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[3], 18))}
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>USDC</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[4], 6))}
                      /
                      {formatValue(utils.formatUnits(balances[6], 18))}
                    </TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[5], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[7], 18))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BUSD</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                     -
                    </TableCell>
                    <TableCell>
                      {formatValue(utils.formatUnits(balances[8], 18))}
                      /
                      {formatValue(utils.formatUnits(balances[9], 18))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
      )
  );
};

export default Balance;
