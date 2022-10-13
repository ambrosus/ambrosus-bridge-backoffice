import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import providers, {
  ambChainId,
  bscChainId,
  ethChainId,
} from '../../utils/providers';
import { createBridgeContract } from '../../utils/contracts';
import {
  Button,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FeesItem from './components/FeesItem';
import TabPanel from '../Home/components/TabPanel';
import { BigNumber, utils } from 'ethers';
import ConfigContext from '../../context/ConfigContext/context';
import { getNetFromAddress } from '../../utils/getNetFromAddress';
import { getDestinationNet } from '../../utils/getDestinationNet';
import { getNetworkByChainId } from '../../utils/networks';
import getEventsFromContract from '../../utils/getEventsFromContract';
import getAmbTokenPrice from '../../utils/getAmbTokenPrice';
import axios from 'axios';
import getSymbolPriceBinance from '../../utils/getSymbolPriceBinance';
import API from '../../api/api';

const itemsPerPage = 10;

const Fees = () => {
  const { bridges } = useContext(ConfigContext);

  const contractAddresses = [
    {
      label: 'Amb/Eth',
      address: bridges[ethChainId].native,
    },
    {
      label: 'Eth/Amb',
      address: bridges[ethChainId].foreign,
    },
    {
      label: 'Amb/Bsc',
      address: bridges[bscChainId].native,
    },
    {
      label: 'Bsc/Amb',
      address: bridges[bscChainId].foreign,
    },
  ];

  const [txs, setTxs] = useState([]);
  const [chainId, setChainId] = useState(bridges[ethChainId].native);
  const [selectedTxs, setSelectedTxs] = useState(null);
  const [ambPrice, setAmbPrice] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);
  const [tab, setTab] = useState(['Amb', 'Eth']);

  const allTxs = useRef([]);

  // useEffect(() => {
  //   fetch('https://token.ambrosus.io/price')
  //     .then((response) => response.json())
  //     .then(({ data }) => {
  //       // setAmbPrice(BigNumber.from(
  //       //   utils.parseUnits(data.total_price_usd.toString(), 18),
  //       // ))
  //     });
  // }, []);

  useEffect(async () => {
    const data = await getAmbTokenPrice();
    setAmbPrice(data.price_usd);
  }, []);

  useEffect(() => {
    const provider = providers[getNetFromAddress(chainId, bridges)];
    const contract = createBridgeContract(chainId, provider);
    setTxs([]);
    setSelectedTxs(null);

    getEventsFromContract(contract, contract.filters.Withdraw())
      .then((res) => mapTxsArray(res.reverse()))
      .catch((e) => console.log(e));
  }, [chainId]);

  const handleSelectedTxs = (item) => {
    setSelectedTxs((selected) => {
      if (selected && selected.eventId === item.eventId) {
        return null;
      }
      return item;
    });
  };

  const mapTxsArray = (transactions) => {
    const arr = [];

    transactions.map((el) => {
      const eventId = el.args.eventId.toNumber();
      const pack = arr.find((pack) => pack.eventId === eventId);

      if (!pack) {
        arr.push({ eventId, txs: [el] });
      } else {
        pack.txs.push(el);
      }
    });
    allTxs.current = arr;
    handlePage(null, 1);
  };

  const handlePage = (_, currentPage) => {
    setSelectedTxs(null);

    const fromIdx = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
    const itemsInPage = allTxs.current.slice(fromIdx, fromIdx + itemsPerPage);

    setTxs(itemsInPage);
  };

  const tableHeads = useMemo(
    () => [
      'Event Id',
      `${getNetworkByChainId(+getNetFromAddress(chainId, bridges)).code} Fee`,
      `${getNetworkByChainId(+getDestinationNet(chainId, bridges)).code} Fee`,
      'Status',
    ],
    [chainId],
  );

  const isEthToken = tab?.includes('Eth');
  const isLeftUsdValue = tab[0] === 'Amb';

  const usdValue = {
    leftUsd: isLeftUsdValue ? ambPrice : tokenPrice,
    rightUsd: isLeftUsdValue ? tokenPrice : ambPrice,
  };

  useEffect(async () => {
    const token = isEthToken ? 'ETHUSDT' : 'BNBUSDT';
    const option = { symbol: token };
    const { data } = await getSymbolPriceBinance(option);
    setTokenPrice(data.price);
  }, [chainId]);

  const pages = Math.ceil(allTxs.current.length / 10);

  return (
    <div className="fees-page">
      {contractAddresses.map((el) => (
        <Button
          sx={{ margin: '20px' }}
          variant="outlined"
          onClick={() => {
            setChainId(el.address);
            setTab(el.label.split('/'));
          }}
          key={el.address}
        >
          {el.label}
        </Button>
      ))}
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
            {txs.map((el) => (
              <FeesItem
                usdValue={usdValue}
                contractAddress={chainId}
                key={el.eventId}
                item={el}
                handleSelectedTxs={handleSelectedTxs}
                isOpen={el.eventId === selectedTxs?.eventId}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={pages} onChange={handlePage} />
      {selectedTxs && <TabPanel txs={selectedTxs.txs} />}
    </div>
  );
};

export default Fees;
