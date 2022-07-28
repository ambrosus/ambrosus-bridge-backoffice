import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import ConfigContext from '../../context/ConfigContext/context';

const Layout = (props) => {
  const { bridges } = useContext(ConfigContext);

  const { children } = props;
  return bridges ? (
    <div className="layout">
      <div className="content">
        <div className="page">{children}</div>
      </div>
    </div>
  ) : null;
};

Layout.propTypes = {
  children: PropTypes.element,
};

export default Layout;
