import React from 'react';
import Home from './pages/Home';
import Balance from './pages/Balance';
import Layout from './layouts/Layout';
import Login from "./pages/Login";

const routes = [
  {
    path: '/',
    key: 'ROOT',
    exact: true,
    component: () => <Login/>,
  },
  {
    path: '/dashboard',
    key: 'ROOT',
    exact: true,
    protectedRoute: true,
    component: () => <Home />,
  },
  {
    path: '/balance',
    key: 'ROOT',
    exact: true,
    protectedRoute: true,
    component: () => (
      <Layout>
        <Balance />
      </Layout>
    ),
  },
];

export default routes;
