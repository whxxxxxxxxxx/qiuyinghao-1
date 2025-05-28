import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { MedicineBoxOutlined, BankOutlined, AppstoreOutlined, UserOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import ExaminationList from './pages/examination';
import ExaminationDetail from './pages/examinationDetail';
import ExaminationItemList from './pages/examinationItem';
import DoctorList from './pages/doctor';
import DoctorDetail from './pages/doctor/detail';
import hospitalLogo from './assets/hospital-logo.png';
import HospitalIntro from './pages/HospitalIntro';
import MaterialList from './pages/MaterialList';
import MaterialDetail from './pages/MaterialDetail';
import ExaminationItemMaterialManage from './pages/ExaminationItemMaterialManage';
import DepartmentList from './pages/DepartmentList';
import DepartmentDetail from './pages/DepartmentDetail';
import Dashboard from './pages/Dashboard';
import './App.css';

const { Header, Content, Sider } = Layout;

const AppContent = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '0',
      icon: <AppstoreOutlined />,
      label: <Link to="/dashboard">医院运营看板</Link>,
    },
    {
      key: '1',
      icon: <BankOutlined />,
      label: <Link to="/hospital-intro">医院介绍</Link>,
    },
    {
      key: '2',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/examination">病历检查管理</Link>,
    },
    {
      key: '3',
      icon: <AppstoreOutlined />,
      label: <Link to="/examinationItem">检查项目管理</Link>,
    },
    {
      key: '4',
      icon: <UserOutlined />,
      label: <Link to="/doctor">医生管理</Link>,
    },
    {
      key: '5',
      icon: <ExperimentOutlined />,
      label: <Link to="/material">材料管理</Link>,
    },
    {
      key: '6',
      icon: <TeamOutlined />,
      label: <Link to="/department">科室管理</Link>,
    },
  ];

  return (
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
            selectedKeys={[location.pathname.split('/')[1] || '1']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
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
              <Route path="/hospital-intro" element={<HospitalIntro />} />
              <Route path="/material" element={<MaterialList />} />
              <Route path="/material/new" element={<MaterialDetail />} />
              <Route path="/material/edit/:id" element={<MaterialDetail />} />
              <Route path="/material/:id" element={<MaterialDetail />} />
              <Route path="/examinationItem/:id/materials" element={<ExaminationItemMaterialManage />} />
              <Route path="/department" element={<DepartmentList />} />
              <Route path="/department/new" element={<DepartmentDetail />} />
              <Route path="/department/edit/:id" element={<DepartmentDetail />} />
              <Route path="/department/:id" element={<DepartmentDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
