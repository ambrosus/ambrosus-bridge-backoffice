import React, {useEffect, useMemo, useState} from 'react';
import {Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import TransactionItem from './TransactionItem';

const itemsPerPage = 20;
const tableHeads = ['Address', 'Token', 'Departure net', 'Destination net', 'Amount', 'Fee', 'Date', 'Status'];

const TabPanel = ({ txs }) => {
  const [currentItems, setCurrentItems] = useState([]);

  const sortedTxs = useMemo(() => {
    return currentItems.sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  }, [currentItems]);

  useEffect(() => {
    handleChange(null, 1)
  }, [txs])

  const handleChange = (_, currentPage) => {
    const fromIdx = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
    const itemsInPage = txs.slice(fromIdx, fromIdx + itemsPerPage);

    const txsArr = [];

    itemsInPage.forEach(async (el) => {
      const { timestamp } = await el.getBlock();

      await el.getTransaction().then((trans) => {
        txsArr.push({ ...trans, timestamp, args: el.args });

        if (txsArr.length === itemsInPage.length) {
          setCurrentItems(txsArr);
        }
      });
    });
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
