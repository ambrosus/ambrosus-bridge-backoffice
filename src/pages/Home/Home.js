import React, {useEffect, useState} from 'react';
import {Tab, Tabs} from '@mui/material';
import providers, {ambChainId, ethChainId} from '../../utils/providers';
import TabPanel from './components/TabPanel';
import createBridgeContract from '../../utils/contracts';

const Home = () => {
  const [currentChainId, setCurrentChainId] = useState(ambChainId);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
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
      </Tabs>
      <TabPanel txs={transactions} />
    </div>
  )
}

export default Home;
