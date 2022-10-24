import React, {useEffect, useMemo, useState} from 'react';
import {Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import TransactionItem from './TransactionItem';

const itemsPerPage = 20;
const tableHeads = ['Address', 'Token', 'Event id', 'Amount', 'Fee', 'Date', 'Status'];

const TabPanel = ({ txs }) => {
  const [currentItems, setCurrentItems] = useState([]);

  const sortedTxs = useMemo(() => {
    return currentItems.sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  }, [currentItems]);

  useEffect(() => {
    handleChange(null, 1)
  }, [txs]);

  const handleChange = async (_, currentPage) => {
    const fromIdx = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
    const itemsInPage = txs.slice(fromIdx, fromIdx + itemsPerPage);

    const txsArr = [];

    for (let i = 0; i < itemsInPage.length; i++) {
      const { timestamp } = await itemsInPage[i].getBlock();

      await itemsInPage[i].getTransaction().then((trans) => {
        txsArr.push({ ...trans, timestamp, args: itemsInPage[i].args });
      });
    }
    setCurrentItems(txsArr);
  };

  const pages = Math.ceil(txs.length / itemsPerPage)

  return !!txs.length && (
    <div className="tab-panel">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {tableHeads.map((el) => (
                <TableCell key={el}>{el}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!!txs.length && sortedTxs.map((el) => (
              <TransactionItem item={el} key={el.hash}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={pages} onChange={handleChange}/>
    </div>
  );
};

export default TabPanel;
