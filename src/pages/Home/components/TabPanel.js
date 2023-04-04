import React, {useEffect, useMemo, useState} from 'react';
import {Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import TransactionItem from './TransactionItem';

const itemsPerPage = 20;
const tableHeads = ['Address', 'Token', 'Event id', 'Amount', 'Fee', 'Date', 'Status'];

const TabPanel = ({ txs }) => {
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    handleChange(null, 1)
  }, [txs]);

  const handleChange = (_, currentPage) => {
    const fromIdx = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
    const itemsInPage = txs.slice(fromIdx, fromIdx + itemsPerPage);

    setCurrentItems(itemsInPage);
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
            {!!txs.length && currentItems.map((el) => (
              <TransactionItem item={el} key={el.withdrawTx.txHash}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={pages} onChange={handleChange}/>
    </div>
  );
};

export default TabPanel;
