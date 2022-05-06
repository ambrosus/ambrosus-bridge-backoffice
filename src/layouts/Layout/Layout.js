import React from 'react';
import PropTypes from 'prop-types';
import {AppBar} from '@mui/material';
import {Link} from 'react-router-dom';

const Layout = (props) => {
  const { children } = props;
  return (
    <div className="layout">
      <div className="content">
        <div className="page">{children}</div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element,
};

export default Layout;
