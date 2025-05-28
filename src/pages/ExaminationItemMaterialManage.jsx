import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Select, InputNumber, message, Popconfirm, Space } from 'antd';
import { getMaterialList, getExaminationItem, addMaterialToItem, removeMaterialFromItem } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ExaminationItemMaterialManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [allMaterials, setAllMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // 获取项目详情及其材料
  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await getExaminationItem(id);
      setItem(res.data);
      setMaterials(res.data.materials || []);
    } catch (e) {
      message.error('获取项目详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有材料
  const fetchAllMaterials = async () => {
    try {
      const res = await getMaterialList();
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setAllMaterials(data);
    } catch (e) {
      message.error('获取材料列表失败');
    }
  };

  useEffect(() => {
    fetchItem();
    fetchAllMaterials();
  }, [id]);

  // 添加材料到项目
  const handleAddMaterial = async () => {
    if (!selectedMaterial || !quantity) return;
    setAdding(true);
    try {
      await addMaterialToItem(id, selectedMaterial, Number(quantity));
      message.success('添加成功');
      setModalVisible(false);
      setSelectedMaterial(null);
      setQuantity(1);
      fetchItem();
    } catch (e) {
      message.error('添加失败');
    } finally {
      setAdding(false);
    }
  };

  // 移除材料
  const handleRemove = async (materialId) => {
    try {
      await removeMaterialFromItem(id, materialId);
      message.success('移除成功');
      fetchItem();
    } catch (e) {
      message.error('移除失败');
    }
  };

  // 计算材料总花费
  const totalMaterialCost = materials.reduce(
    (sum, m) => sum + (m.material?.price || 0) * (m.quantity || 0),
    0
  );

  const columns = [
    { title: '材料名称', dataIndex: ['material', 'name'], key: 'name' },
    { title: '材料价格', dataIndex: ['material', 'price'], key: 'price' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="确定移除该材料？" onConfirm={() => handleRemove(record.materialId)} okText="确定" cancelText="取消">
          <Button type="link" danger>移除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>项目材料管理 - {item?.name}</h2>
      <div style={{ margin: '16px 0', fontWeight: 'bold' }}>
        材料总花费：¥{totalMaterialCost.toFixed(2)}
      </div>
      <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>添加材料</Button>
      <Table
        rowKey="ID"
        loading={loading}
        columns={columns}
        dataSource={materials}
        pagination={false}
      />
      <Button style={{ marginTop: 16 }} onClick={() => navigate(-1)}>返回</Button>
      <Modal
        title="添加材料"
        open={modalVisible}
        onOk={handleAddMaterial}
        onCancel={() => setModalVisible(false)}
        confirmLoading={adding}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            style={{ width: '100%' }}
            placeholder="选择材料"
            value={selectedMaterial}
            onChange={setSelectedMaterial}
            options={allMaterials.map(m => ({ label: m.name, value: m.ID }))}
          />
          <InputNumber
            min={1}
            value={quantity}
            onChange={setQuantity}
            style={{ width: '100%' }}
            placeholder="数量"
          />
        </Space>
      </Modal>
    </div>
  );
};

export default ExaminationItemMaterialManage; 