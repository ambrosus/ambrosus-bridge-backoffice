import React, {useEffect, useState} from 'react';
import providers, {ambChainId, ethChainId} from '../../utils/providers';
import createBridgeContract from '../../utils/contracts';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import FeesItem from './components/FeesItem';
import TabPanel from '../Home/components/TabPanel';

const Fees = () => {
  const [txs, setTxs] = useState([]);
  const [chainId, setChainId] = useState(ambChainId);
  const [selectedTxs, setSelectedTxs] = useState(null);

  useEffect(() => {
    const provider = providers[chainId];
    const contract = createBridgeContract[chainId](provider);
    setTxs([]);

    contract
      .queryFilter(contract.filters.Withdraw())
      .then((res) => mapTxsArray(res.reverse()))
      .catch((e) => {
        console.log(e);
      })
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
        arr.push({ eventId, txs: [el] })
      } else {
        pack.txs.push(el);
      }
    })
    setTxs(arr);
  };

  const handleSwitch = () => {
    setChainId((state) => state === ambChainId ? ethChainId : ambChainId);
  };

  const tableHeads = [
    'Event Id',
    `${chainId === ambChainId ? 'AMB' : 'ETH'} Fee`,
    `${chainId !== ambChainId ? 'AMB' : 'ETH'} Fee`,
    'Status'
  ];

  return (
    <div className="fees-page">
      <Button sx={{ margin: '20px' }} variant="outlined" onClick={handleSwitch}>
        Switch network to {chainId === ambChainId ? 'Ethereum' : 'Ambrosus'}
      </Button>
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
                key={el.eventId}
                item={el}
                handleSelectedTxs={handleSelectedTxs}
                isOpen={el.eventId === selectedTxs?.eventId}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedTxs && (
        <TabPanel txs={selectedTxs.txs}/>
      )}
    </div>
  )
};

export default Fees;
