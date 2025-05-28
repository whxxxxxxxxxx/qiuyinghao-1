import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, message, Modal, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMaterialList, deleteMaterial } from '../services/api';

const MaterialList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();

  const fetchMaterials = async (p = page, ps = pageSize, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', p);
      params.append('pageSize', ps);
      
      if (filters.name) {
        params.append('name', filters.name);
      }
      
      const response = await getMaterialList(params);
      // 兼容后端返回数组或对象格式
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const total = response.data.total || data.length || 0;
      setDataSource(data);
      setTotal(total);
    } catch (error) {
      message.error('获取材料列表失败');
      console.error('获取材料列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchMaterials(1, pageSize, {
      name: searchName
    });
  };

  const handleReset = () => {
    setSearchName('');
    setPage(1);
    fetchMaterials(1, pageSize, {});
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    fetchMaterials(pagination.current, pagination.pageSize, {
      name: searchName
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMaterial(id);
      message.success('删除成功');
      fetchMaterials();
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  const columns = [
    {
      title: '材料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '材料价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/material/${record.ID}`)}>
            查看
          </Button>
          <Button type="link" onClick={() => navigate(`/material/edit/${record.ID}`)}>
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
            placeholder="材料名称"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>重置</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/material/new')}
          >
            新增材料
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

export default MaterialList; 