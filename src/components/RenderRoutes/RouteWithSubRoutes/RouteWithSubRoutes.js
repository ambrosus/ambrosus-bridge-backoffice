import React from 'react';
import {Redirect, Route} from 'react-router';

export const RouteWithSubRoutes = (route) => {
  const { path, exact, routes, protectedRoute } = route;
  return (
      protectedRoute && !document.cookie.includes('backoffice verified') ?
          <Redirect to="/" /> :
    <Route
      path={path}
      exact={exact}
      render={(props) => <route.component {...props} routes={routes} />}
    />
  );
};

export default RouteWithSubRoutes;
