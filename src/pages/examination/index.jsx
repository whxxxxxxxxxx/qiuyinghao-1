import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Input, Card, Row, Col, Select, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getExaminationList, deleteExamination, getDoctorList, getExaminationItemList, exportExaminationsToExcel } from '../../services/api';

const { Option } = Select;

const ExaminationList = () => {
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [examinationItems, setExaminationItems] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedExaminationItem, setSelectedExaminationItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExaminations();
    fetchDoctors();
    fetchExaminationItems();
  }, []);

  const fetchExaminations = async (filters = {}) => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams();
      
      if (filters.patientName) {
        params.append('patientName', filters.patientName);
      }
      
      if (filters.doctorID) {
        params.append('doctor', filters.doctorID);
      }
      
      if (filters.examinationItemID) {
        params.append('examinationItem', filters.examinationItemID);
      }
      
      // 修改API调用，传入查询参数
      const response = await getExaminationList(params.toString() ? `?${params.toString()}` : '');
      setExaminations(response.data.data || []);
    } catch (error) {
      message.error('获取病历检查记录失败');
      console.error('获取病历检查记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await getDoctorList();
      // 确保正确获取医生列表数据
      setDoctors(Array.isArray(response.data) ? response.data : 
                (Array.isArray(response.data.data) ? response.data.data : []));
    } catch (error) {
      console.error('获取医生列表失败:', error);
      setDoctors([]);
    }
  };

  const fetchExaminationItems = async () => {
    try {
      const response = await getExaminationItemList();
      // 确保 examinationItems 是一个数组
      setExaminationItems(Array.isArray(response.data) ? response.data : 
                      (Array.isArray(response.data.data) ? response.data.data : []));
    } catch (error) {
      console.error('获取检查项目列表失败:', error);
      // 确保在出错时 examinationItems 也是一个空数组
      setExaminationItems([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExamination(id);
      message.success('删除成功');
      fetchExaminations();
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  const handleSearch = () => {
    // 构建筛选条件
    const filters = {
      patientName: searchText,
      doctorID: selectedDoctor,
      examinationItemID: selectedExaminationItem
    };
    
    // 调用API进行筛选
    fetchExaminations(filters);
  };
  
  const handleReset = () => {
    setSearchText('');
    setSelectedDoctor(null);
    setSelectedExaminationItem(null);
    fetchExaminations();
  };

  const getDoctorName = (doctorId) => {
    // 确保 doctors 是一个数组再调用 find 方法
    if (!Array.isArray(doctors)) {
      return '未知医生';
    }
    const doctor = doctors.find(d => d.ID === doctorId);
    return doctor ? doctor.name : '未知医生';
  };

  const getExaminationItemName = (itemId) => {
    // 确保 examinationItems 是一个数组再调用 find 方法
    if (!Array.isArray(examinationItems)) {
      return '未知项目';
    }
    const item = examinationItems.find(i => i.id === itemId || i.ID === itemId);
    return item ? item.name : '未知项目';
  };

  const columns = [
    {
      title: '病号',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: '检查项目',
      dataIndex: 'examinationItemID',
      key: 'examinationItemID',
      render: (itemId) => getExaminationItemName(itemId),
    },
    {
      title: '检查次数',
      dataIndex: 'examinationCount',
      key: 'examinationCount',
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '开单医生',
      dataIndex: 'doctorID',
      key: 'doctorID',
      render: (doctorId) => getDoctorName(doctorId),
    },
    {
      title: '成本分配率',
      dataIndex: 'costAllocationRate',
      key: 'costAllocationRate',
      render: (rate) => `${(rate * 100).toFixed(2)}%`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/examination/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleExport = () => {
    // 构建导出筛选条件
    const exportParams = {};
    
    if (searchText) {
      exportParams.patientName = searchText;
    }
    
    if (selectedDoctor) {
      exportParams.doctorID = selectedDoctor;
    }
    
    if (selectedExaminationItem) {
      exportParams.examinationItemID = selectedExaminationItem;
    }
    
    // 调用导出API
    exportExaminationsToExcel(exportParams);
    message.success('导出请求已发送，文件将自动下载');
  };

  return (
    <div>
      <Card title="病历检查记录管理" style={{ marginBottom: 16 }}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="病号">
            <Input
              placeholder="搜索病号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
            />
          </Form.Item>
          
          <Form.Item label="检查项目">
            <Select
              placeholder="选择检查项目"
              value={selectedExaminationItem}
              onChange={setSelectedExaminationItem}
              allowClear
              style={{ width: 200 }}
            >
              {examinationItems.map(item => (
                <Option key={item.ID || item.id} value={item.ID || item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="医生">
            <Select
              placeholder="选择医生"
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              allowClear
              style={{ width: 200 }}
            >
              {doctors.map(doctor => (
                <Option key={doctor.ID} value={doctor.ID}>
                  {doctor.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" icon={<FilterOutlined />} onClick={handleSearch} style={{ marginRight: 8 }}>
              筛选
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        
        <Row style={{ marginBottom: 16 }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Row justify="end" style={{ marginTop: 16 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate('/examination/new')}
                >
                  新增检查记录
                </Button>
                <Button 
                  type="primary" 
                  icon={<FilterOutlined />} 
                  onClick={handleExport}
                  style={{ marginLeft: 8 }}
                >
                  导出检查记录
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={examinations}
          rowKey="ID"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ExaminationList;