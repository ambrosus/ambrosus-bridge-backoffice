import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import ConfigContext from '../../context/ConfigContext/context';
import getAmbTokenPrice from '../../utils/getAmbTokenPrice';
import getSymbolPriceBinance from '../../utils/getSymbolPriceBinance';
import axios from 'axios';
import {ambChainId, bscChainId, ethChainId} from "../../utils/providers";

const itemsPerPage = 10;

const Fees = () => {
  const { bridges } = useContext(ConfigContext);

  const contractAddresses = [
    {
      label: 'Amb/Eth',
      address: 'amb/eth',
    },
    {
      label: 'Eth/Amb',
      address: 'eth/amb',
    },
    {
      label: 'Amb/Bsc',
      address: 'amb/bsc',
    },
    {
      label: 'Bsc/Amb',
      address: 'bsc/amb',
    },
  ];

  const [txs, setTxs] = useState({});
  const [chains, setChains] = useState('amb/eth');
  const [selectedTxs, setSelectedTxs] = useState(null);
  const [ambPrice, setAmbPrice] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(null);

  const allTxs = useRef([]);

  useEffect(async () => {
    const data = await getAmbTokenPrice();
    setAmbPrice(data.price_usd);
  }, []);

  useEffect(() => {
    const chns = chains.split('/');

    axios.get(`https://backoffice-api.ambrosus-test.io/backoffice?networkFrom=${chns[0]}&networkTo=${chns[1]}`)
      .then(({ data }) => {
        mapTxsArray(data.reverse())
      });
  }, [chains]);

  const handleSelectedTxs = (item) => {
    setSelectedTxs((selected) => {
      if (selected && item && selected[0].eventId === item[0].eventId) {
        return null;
      }
      return item;
    });
  };

  const mapTxsArray = (transactions) => {
    allTxs.current = transactions;
    handlePage(null, 1);
  };

  const handlePage = (_, currentPage) => {
    setSelectedTxs(null);

    const fromIdx = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
    const itemsInPage = allTxs.current.slice(fromIdx, fromIdx + itemsPerPage);

    setTxs({ transactions: itemsInPage, chains });
  };

  const tableHeads = useMemo(
    () => [
      'Event Id',
      `${chains.split('/')[0]} Fee`,
      `${chains.split('/')[1]} Fee`,
      'Status',
    ],
    [chains],
  );

  const isEthToken = chains?.includes('eth');

  useEffect(async () => {
    const token = isEthToken ? 'ETHUSDT' : 'BNBUSDT';
    const option = { symbol: token };
    const { data } = await getSymbolPriceBinance(option);
    setTokenPrice(data.price);
  }, [chains]);

  const pages = Math.ceil(allTxs.current.length / 10);

  return (
    <div className="fees-page">
      {contractAddresses.map((el) => (
        <Button
          sx={{ margin: '20px', background: el.address === chains ? '#e4f2ff' : 'transparent' }}
          variant="outlined"
          onClick={() => setChains(el.address)}
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
            {txs.transactions?.map((el) => (
              <FeesItem
                tokensPrice={ {
                  amb: ambPrice,
                  token: tokenPrice
                }}
                chains={txs.chains}
                key={el.eventId}
                item={el}
                handleSelectedTxs={handleSelectedTxs}
                isOpen={selectedTxs && el.eventId === selectedTxs[0]?.eventId}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={pages} onChange={handlePage} />
      {selectedTxs && <TabPanel txs={selectedTxs} />}
    </div>
  );
};

export default Fees;
