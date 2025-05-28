import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getExaminationItemList, createExaminationItem, updateExaminationItem, deleteExaminationItem } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ExaminationItemList = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const navigate = useNavigate();

  const fetchExaminationItemList = () => {
    setLoading(true);
    getExaminationItemList()
      .then(response => {
        setDataSource(response.data.data || response.data);
      })
      .catch(error => {
        message.error('获取检查项目列表失败: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExaminationItemList();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      name: record.name,
      amount: record.amount,
      insuranceAmount: record.insuranceAmount,
      costRatio: record.costRatio,
      departmentRatio: record.departmentRatio
    });
    setEditingItem(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    setLoading(true);
    deleteExaminationItem(id)
      .then(() => {
        message.success('删除成功');
        fetchExaminationItemList();
      })
      .catch(error => {
        message.error('删除失败: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      setLoading(true);
      const api = editingItem 
        ? updateExaminationItem(editingItem.ID, values) 
        : createExaminationItem(values);
      
      api.then(() => {
        message.success(`${editingItem ? '更新' : '创建'}成功`);
        setModalVisible(false);
        fetchExaminationItemList();
      })
      .catch(error => {
        message.error(`${editingItem ? '更新' : '创建'}失败: ` + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    });
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `¥${text.toFixed(2)}`
    },
    {
      title: '医保结算金额',
      dataIndex: 'insuranceAmount',
      key: 'insuranceAmount',
      render: (text) => `¥${text.toFixed(2)}`
    },
    {
      title: '材料花费',
      key: 'materialCost',
      render: (_, record) => {
        const total = (record.materials || []).reduce(
          (sum, m) => sum + (m.material?.price || 0) * (m.quantity || 0),
          0
        );
        return `¥${total.toFixed(2)}`;
      }
    },
    {
      title: '成本比例',
      dataIndex: 'costRatio',
      key: 'costRatio',
      render: (text) => `${(text * 100).toFixed(0)}%`
    },
    {
      title: '科室分配比例',
      dataIndex: 'departmentRatio',
      key: 'departmentRatio',
      render: (text) => `${(text * 100).toFixed(0)}%`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个检查项目吗?"
            onConfirm={() => handleDelete(record.ID)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
          <Button type="link" onClick={() => navigate(`/examinationItem/${record.ID}/materials`)}>
            管理材料
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
        >
          新增检查项目
        </Button>
      </div>
      <Table 
        rowKey="ID"
        loading={loading}
        columns={columns} 
        dataSource={dataSource} 
      />

      <Modal
        title={editingItem ? '编辑检查项目' : '新增检查项目'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="金额"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <InputNumber min={0} step={0.01} placeholder="请输入金额" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="insuranceAmount"
            label="医保结算金额"
            rules={[{ required: true, message: '请输入医保结算金额' }]}
          >
            <InputNumber min={0} step={0.01} placeholder="请输入医保结算金额" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="costRatio"
            label="成本比例"
            rules={[{ required: true, message: '请输入成本比例' }]}
          >
            <InputNumber 
              min={0} 
              max={1} 
              step={0.01} 
              placeholder="请输入成本比例" 
              style={{ width: '100%' }} 
              formatter={value => `${(value * 100).toFixed(0)}%`}
              parser={value => value.replace('%', '') / 100}
            />
          </Form.Item>

          <Form.Item
            name="departmentRatio"
            label="科室分配比例"
            rules={[{ required: true, message: '请输入科室分配比例' }]}
          >
            <InputNumber 
              min={0} 
              max={1} 
              step={0.01} 
              placeholder="请输入科室分配比例" 
              style={{ width: '100%' }} 
              formatter={value => `${(value * 100).toFixed(0)}%`}
              parser={value => value.replace('%', '') / 100}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExaminationItemList;