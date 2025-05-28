import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { getDepartmentList, deleteDepartment } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DepartmentList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getDepartmentList();
      setDataSource(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (e) {
      message.error('获取科室列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      message.success('删除成功');
      fetchDepartments();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: '科室名称', dataIndex: 'name', key: 'name' },
    { title: '科室介绍', dataIndex: 'description', key: 'description' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/department/${record.ID}`)}>查看</Button>
          <Button type="link" onClick={() => navigate(`/department/edit/${record.ID}`)}>编辑</Button>
          <Popconfirm title="确定要删除该科室吗？" onConfirm={() => handleDelete(record.ID)} okText="确定" cancelText="取消">
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => navigate('/department/new')}>新增科室</Button>
      <Table
        rowKey="ID"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  );
};

export default DepartmentList; 