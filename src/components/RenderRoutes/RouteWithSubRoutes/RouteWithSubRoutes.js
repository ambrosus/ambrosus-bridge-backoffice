import React from 'react';
import {Redirect, Route} from 'react-router';

import AuthContext from "../../../context/AuthContext/context";

export const RouteWithSubRoutes = (route) => {
  const { path, exact, routes, protectedRoute } = route;

  const { isAuthorized } = React.useContext(AuthContext);

  return (
      protectedRoute && !isAuthorized ?
          <Redirect to="/" /> :
    <Route
      path={path}
      exact={exact}
      render={(props) => <route.component {...props} routes={routes} />}
    />
  );
};

export default RouteWithSubRoutes;
