import React, {useEffect, useState, useContext} from 'react';
import {Tab, Tabs} from '@mui/material';
import providers, {ambChainId, bscChainId, ethChainId} from '../../utils/providers';
import TabPanel from './components/TabPanel';
import {createBridgeContract} from '../../utils/contracts';
import Balance from '../Balance';
import Fees from '../Fees/Fees';
import ConfigContext from '../../context/ConfigContext/context';
import {getNetFromAddress} from '../../utils/getNetFromAddress';
import getEventsFromContract from '../../utils/getEventsFromContract';
import FeesBalances from '../FeesBalances/FeesBalances';

const Home = () => {
  const { bridges } = useContext(ConfigContext);

  const [currentChainAddress, setCurrentChainAddress] = useState(bridges[ethChainId].native);
  const [transactions, setTransactions] = useState([]);
  const [isAmbEthPaused, setIsAmbEthPaused] = useState(false);
  const [isEthAmbPaused, setIsEthAmbPaused] = useState(false);
  const [isEthBscPaused, setIsAmbBscPaused] = useState(false);
  const [isBscAmbPaused, setIsBscAmbPaused] = useState(false);

  useEffect(async () => {
    const ambEthContract = createBridgeContract(
      bridges[ethChainId].native,
      providers[ambChainId],
    );
    const ethAmbContract = createBridgeContract(
      bridges[ethChainId].foreign,
      providers[ethChainId],
    );
    const ambBscContract = createBridgeContract(
      bridges[bscChainId].native,
      providers[ambChainId],
    );
    const bscAmbContract = createBridgeContract(
      bridges[bscChainId].foreign,
      providers[bscChainId],
    );
    const ambEthPaused = await ambEthContract.paused();
    const ethAmbPaused = await ethAmbContract.paused();
    const ambBscPaused = await ambBscContract.paused();
    const bscAmbPaused = await bscAmbContract.paused();

    setIsAmbEthPaused(ambEthPaused);
    setIsEthAmbPaused(ethAmbPaused);
    setIsAmbBscPaused(ambBscPaused);
    setIsBscAmbPaused(bscAmbPaused);
  }, []);

  useEffect(() => {
    if (Number.isInteger(currentChainAddress)) return;
    const contract = createBridgeContract(currentChainAddress, providers[getNetFromAddress(currentChainAddress, bridges)]);
    const filter = contract.filters.Withdraw();
    setTransactions([]);

    getEventsFromContract(contract, filter)
      .then((res) => {
        setTransactions(res.reverse());
      })
      .catch((e) => {
        console.log(e);
      })
  }, [currentChainAddress]);

  const changeTab = (_, chainId) => {
    setCurrentChainAddress(chainId);
  };

  return (
    <div className="transactions-page">
      <Tabs value={currentChainAddress} onChange={changeTab}>
        <Tab label="Amb/Eth" value={bridges[ethChainId].native} />
        <Tab label="Eth/Amb" value={bridges[ethChainId].foreign} />
        <Tab label="Amb/Bsc" value={bridges[bscChainId].native} />
        <Tab label="Bsc/Amb" value={bridges[bscChainId].foreign} />
        <Tab label="Balance" value={100} />
        <Tab label="Fees" value={99} />
        <Tab label="Fees balances" value={98} />
      </Tabs>
      <div className="paused-networks">
        <div>
          <p>Eth/Amb status: {isEthAmbPaused ? 'Paused' : 'Working'}</p>
          <p>Amb/Eth status: {isAmbEthPaused ? 'Paused' : 'Working'}</p>
        </div>
        <div>
          <p>Bsc/Amb status: {isEthBscPaused ? 'Paused' : 'Working'}</p>
          <p>Amb/Bsc status: {isBscAmbPaused ? 'Paused' : 'Working'}</p>
        </div>
      </div>
      {currentChainAddress === 99 && (
        <Fees />
      )}
      {currentChainAddress === 100 && (
        <Balance />
      )}
      {currentChainAddress === 98 && (
        <FeesBalances />
      )}
      {!Number.isInteger(currentChainAddress) && (
        <TabPanel txs={transactions} />
      )}
    </div>
  )
}

export default Home;
