import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Header from './components/layout/header';
import { AuthContext } from './components/context/auth.context';
import axios from './util/axios.customize';

const { Content } = Layout;

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      // Gọi API profile để check token còn hạn không
      const res = await axios.get("/api/auth/user/profile"); 
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: { 
            email: res.user?.email || "", 
            name: res.user?.fullName || "" 
          }
        });
      }
      setAppLoading(false);
    };
    fetchAccount();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {appLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          <Header />
          <Content>
            <Outlet /> {/* Nơi hiển thị HomePage, LoginPage hoặc RegisterPage */}
          </Content>
        </>
      )}
    </Layout>
  );
}

export default App;