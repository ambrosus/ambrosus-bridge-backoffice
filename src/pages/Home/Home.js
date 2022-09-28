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

const Home = () => {
  const { bridges } = useContext(ConfigContext);

  const [currentChainAddress, setCurrentChainAddress] = useState(bridges[ethChainId].native);
  const [transactions, setTransactions] = useState([]);
  const [isAmbPaused, setIsAmbPaused] = useState(false);
  const [isEthPaused, setIsEthPaused] = useState(false);

  useEffect(async () => {
    const ambContract = createBridgeContract(
      bridges[ethChainId].native,
      providers[ambChainId],
    );
    const ethContract = createBridgeContract(
      bridges[ethChainId].foreign,
      providers[ethChainId],
    );
    const ambPaused = await ambContract.paused();
    const ethPaused = await ethContract.paused();

    setIsAmbPaused(ambPaused);
    setIsEthPaused(ethPaused);
  }, []);

  useEffect(() => {
    if (currentChainAddress === 99 || currentChainAddress === 100) return;
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
      </Tabs>
      <div className="paused-networks">
        <p>Eth status: {isEthPaused ? 'Paused' : 'Working'}</p>
        <p>Amb status: {isAmbPaused ? 'Paused' : 'Working'}</p>
      </div>
      {currentChainAddress === 99 && (
        <Fees />
      )}
      {currentChainAddress === 100 && (
        <Balance />
      )}
      {!Number.isInteger(currentChainAddress) && (
        <TabPanel txs={transactions} />
      )}
    </div>
  )
}

export default Home;
