import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link} from 'react-router-dom';
import Main from './Main';
import {AppBar, Box, Typography} from '@mui/material';

ReactDOM.render(
  <BrowserRouter>
    <AppBar sx={{flexDirection: 'row', background: '#414141', padding: '10px 20px'}} position="static">
      <Link to="/">
        <Typography sx={{color: 'white'}}>
          Transactions
        </Typography>
      </Link>
      <Link to="/balance">
        <Typography sx={{color: 'white', marginLeft: '20px'}}>
          Balances
        </Typography>
      </Link>
    </AppBar>
    <Main />
  </BrowserRouter>,
  document.getElementById('root'),
);
