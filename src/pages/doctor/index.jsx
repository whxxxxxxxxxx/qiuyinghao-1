import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, message, Modal, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDoctorList, deleteDoctor } from '../../services/api';

const DoctorList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchName, setSearchName] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const navigate = useNavigate();

  const fetchDoctors = async (p = page, ps = pageSize, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', p);
      params.append('pageSize', ps);
      
      if (filters.name) {
        params.append('name', filters.name);
      }
      
      if (filters.department) {
        params.append('department', filters.department);
      }
      
      const response = await getDoctorList(params);
      setDataSource(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      message.error('获取医生列表失败');
      console.error('获取医生列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchDoctors(1, pageSize, {
      name: searchName,
      department: searchDepartment
    });
  };

  const handleReset = () => {
    setSearchName('');
    setSearchDepartment('');
    setPage(1);
    fetchDoctors(1, pageSize, {});
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchDoctors(pagination.current, pagination.pageSize, {
      name: searchName,
      department: searchDepartment
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      message.success('删除成功');
      fetchDoctors();
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  const columns = [
    {
      title: '医生姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '科室',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/doctor/${record.ID}`)}>
            查看
          </Button>
          <Button type="link" onClick={() => navigate(`/doctor/edit/${record.ID}`)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.ID)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="医生姓名"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
          />
          <Input
            placeholder="科室"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/doctor/new')}
          >
            新增医生
          </Button>
        </Space>
      </div>
      <Table
        rowKey="ID"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default DoctorList;