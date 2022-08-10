import React from 'react';
import RenderRoutes from './components/RenderRoutes';
import Layout from './layouts/Layout';
import routes from './routes';
import './styles/Main.scss';
import ConfigProvider from './context/ConfigContext/provider';

const Main = () => (
  <ConfigProvider>
    <Layout>
      <RenderRoutes routes={routes} />
    </Layout>
  </ConfigProvider>
);

export default Main;
