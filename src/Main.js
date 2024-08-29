import React from 'react';
import RenderRoutes from './components/RenderRoutes';
import Layout from './layouts/Layout';
import routes from './routes';
import './styles/Main.scss';
import ConfigProvider from './context/ConfigContext/provider';
import AuthProvider from "./context/AuthContext/provider";

const Main = () => (
  <ConfigProvider>
    <AuthProvider>
      <Layout>
        <RenderRoutes routes={routes} />
      </Layout>
    </AuthProvider>
  </ConfigProvider>
);

export default Main;
