import React from 'react';
import Home from './pages/Home';
import Balance from './pages/Balance';
import Layout from './layouts/Layout';

const routes = [
  {
    path: '/',
    key: 'ROOT',
    exact: true,
    component: () => <Home />,
  },
  {
    path: '/balance',
    key: 'ROOT',
    exact: true,
    component: () => (
      <Layout>
        <Balance />
      </Layout>
    ),
  },
];

export default routes;
