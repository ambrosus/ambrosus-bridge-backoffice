import React, {useEffect, useState} from 'react';
import getTokenBalance from '../../utils/getTokenBalance';
import providers, {ambChainId, ethChainId} from '../../utils/providers';
import config from '../../utils/bridge-config.json';
import createBridgeContract, {ambContractAddress, ethContractAddress} from '../../utils/contracts';
import {utils} from 'ethers';
const Balance = () => {
  const [balances, setBalances] = useState(null);
  const [isAmbPaused, setIsAmbPaused] = useState(false);
  const [isEthPaused, setIsEthPaused] = useState(false);

  useEffect(async () => {
    handleBalances();
    handlePausedNetworks();
  }, []);

  const handleBalances = async () => {
    const sambInEth = await getTokenBalance(providers[ethChainId], config.tokens.SAMB.addresses.eth, ethContractAddress);
    const wethInEth = await getTokenBalance(providers[ethChainId], config.tokens.WETH.addresses.eth, ethContractAddress);
    const sambInAmb = await getTokenBalance(providers[ambChainId], config.tokens.SAMB.addresses.amb, ambContractAddress);
    const wethInAmb = await getTokenBalance(providers[ambChainId], config.tokens.WETH.addresses.amb, ambContractAddress);

    Promise.all([sambInEth, wethInEth, sambInAmb, wethInAmb])
      .then((res) => {
        setBalances(res);
      })
  }

  const handlePausedNetworks = async () => {
    const ambContract = createBridgeContract[ambChainId](providers[ambChainId]);
    const ethContract = createBridgeContract[ethChainId](providers[ethChainId]);

    const ambPaused = await ambContract.paused();
    const ethPaused = await ethContract.paused();

    setIsAmbPaused(ambPaused);
    setIsEthPaused(ethPaused);
  }

  return balances && (
    <div>
      <p>Balances:</p>
      <p>SAMB in ETH: {utils.formatUnits(balances[0], 18)}</p>
      <p>WETH in ETH: {utils.formatUnits(balances[1], 18)}</p>
      <p>SAMB in AMB: {utils.formatUnits(balances[2], 18)}</p>
      <p>WETH in AMB: {utils.formatUnits(balances[3], 18)}</p>
      <br/>
      <p>Paused networks:</p>
      <p>Eth status: {isEthPaused ? 'Paused' : 'Working'}</p>
      <p>Amb status: {isAmbPaused ? 'Paused' : 'Working'}</p>
    </div>
  );
}

export default Balance;
