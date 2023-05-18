import React, {useEffect, useState, useContext} from 'react';
import {Tab, Tabs} from '@mui/material';
import providers, {ambChainId, bscChainId, ethChainId} from '../../utils/providers';
import TabPanel from './components/TabPanel';
import {createBridgeContract} from '../../utils/contracts';
import Balance from '../Balance';
import Fees from '../Fees/Fees';
import ConfigContext from '../../context/ConfigContext/context';
import axios from 'axios';

const Home = () => {
  const { bridges } = useContext(ConfigContext);

  const [currentTab, setCurrentTab] = useState('amb/eth');
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
    setTransactions([]);
    if (Number.isInteger(currentTab)) return;

    const chains = currentTab.split('/');

    axios.get(`https://backoffice-api.ambrosus-test.io/backoffice?networkFrom=${chains[0]}&networkTo=${chains[1]}`)
      .then(({ data }) => {
        let txs = [];

        let departureChainId = ambChainId;
        let destinationChainId = ambChainId;

        if (chains[0] === 'eth') {
          departureChainId = ethChainId;
        } else if (chains[0] === 'bsc') {
          departureChainId = bscChainId;
        }
        if (chains[1] === 'eth') {
          destinationChainId = ethChainId;
        } else if (chains[1] === 'bsc') {
          destinationChainId = bscChainId;
        }

        data.forEach((el) => {
          txs = [...txs, ...el.transfers.map((tx) => ({
            ...tx,
            chainId: departureChainId,
            destChainId: destinationChainId,
            eventId: el.eventId,
            destinationTxHash: el.transferFinishTx.txHash,
            status: el.status
          }))]
        })
        setTransactions(txs.sort((a, b) => b.withdrawTx.txTimestamp - a.withdrawTx.txTimestamp))
      });
  }, [currentTab]);

  const changeTab = (_, chainId) => {
    setCurrentTab(chainId);
  };

  return (
    <div className="transactions-page">
      <Tabs value={currentTab} onChange={changeTab}>
        <Tab label="Amb/Eth" value={'amb/eth'} />
        <Tab label="Eth/Amb" value={'eth/amb'} />
        <Tab label="Amb/Bsc" value={'amb/bsc'} />
        <Tab label="Bsc/Amb" value={'bsc/amb'} />
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
      {currentTab === 99 && (
        <Fees />
      )}
      {currentTab === 100 && (
        <Balance />
      )}
      {!Number.isInteger(currentTab) && (
        <TabPanel txs={transactions} />
      )}
    </div>
  )
}

export default Home;
