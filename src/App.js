import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { MedicineBoxOutlined, FileSearchOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import ExaminationList from './pages/examination';
import ExaminationDetail from './pages/examinationDetail';
import ExaminationItemList from './pages/examinationItem';
import DoctorList from './pages/doctor';
import DoctorDetail from './pages/doctor/detail';
import hospitalLogo from './assets/hospital-logo.png';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="header">
          <div className="logo">
            <img src={hospitalLogo} alt="医院Logo" className="hospital-logo" />
          </div>
          <h1 style={{ color: 'white' }}>医疗检查管理系统</h1>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<MedicineBoxOutlined />}>
                <Link to="/examination">病历检查管理</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<AppstoreOutlined />}>
                <Link to="/examinationItem">检查项目管理</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                <Link to="/doctor">医生管理</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: '#fff',
              }}
            >
              <Routes>
                <Route path="/" element={<ExaminationList />} />
                <Route path="/examination" element={<ExaminationList />} />
                <Route path="/examination/edit/:id" element={<ExaminationDetail />} />
                <Route path="/examination/:id" element={<ExaminationDetail />} />
                <Route path="/examinationItem" element={<ExaminationItemList />} />
                <Route path="/doctor" element={<DoctorList />} />
                <Route path="/doctor/new" element={<DoctorDetail />} />
                <Route path="/doctor/edit/:id" element={<DoctorDetail />} />
                <Route path="/doctor/:id" element={<DoctorDetail />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
