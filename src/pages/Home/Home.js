import React, {useEffect, useState} from 'react';
import {Tab, Tabs} from '@mui/material';
import providers, {ambChainId, ethChainId} from '../../utils/providers';
import TabPanel from './components/TabPanel';
import createBridgeContract from '../../utils/contracts';
import Balance from '../Balance';
import Fees from '../Fees/Fees';

const Home = () => {
  const [currentChainId, setCurrentChainId] = useState(ambChainId);
  const [transactions, setTransactions] = useState([]);
  const [isAmbPaused, setIsAmbPaused] = useState(false);
  const [isEthPaused, setIsEthPaused] = useState(false);

  useEffect(async () => {
    const ambContract = createBridgeContract[ambChainId](providers[ambChainId]);
    const ethContract = createBridgeContract[ethChainId](providers[ethChainId]);

    const ambPaused = await ambContract.paused();
    const ethPaused = await ethContract.paused();

    setIsAmbPaused(ambPaused);
    setIsEthPaused(ethPaused);
  }, []);

  useEffect(() => {
    if (currentChainId === 'balance' || currentChainId === 'fees') return;

    const provider = providers[currentChainId];
    const contract = createBridgeContract[currentChainId](provider);
    setTransactions([]);

    contract
      .queryFilter(contract.filters.Withdraw())
      .then((res) => {
        setTransactions(res.reverse());
      })
      .catch((e) => {
        console.log(e);
      })
  }, [currentChainId]);

  const changeTab = (_, chainId) => {
    setCurrentChainId(chainId);
  };

  return (
    <div className="transactions-page">
      <Tabs value={currentChainId} onChange={changeTab} aria-label="basic tabs example">
        <Tab label="Ambrosus" value={ambChainId} />
        <Tab label="Ethereum" value={ethChainId} />
        <Tab label="Balance" value={'balance'} />
        <Tab label="Fees" value={'fees'} />
      </Tabs>
      <div className="paused-networks">
        <p>Eth status: {isEthPaused ? 'Paused' : 'Working'}</p>
        <p>Amb status: {isAmbPaused ? 'Paused' : 'Working'}</p>
      </div>
      {currentChainId === 'fees' && (
        <Fees />
      )}
      {currentChainId === 'balance' && (
        <Balance />
      )}
      {Number.isInteger(currentChainId) && (
        <TabPanel txs={transactions} />
      )}
    </div>
  )
}

export default Home;
