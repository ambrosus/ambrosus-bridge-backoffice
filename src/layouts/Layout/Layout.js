import React from 'react';
import PropTypes from 'prop-types';

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
