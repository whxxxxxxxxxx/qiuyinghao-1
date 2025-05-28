import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getMaterial, createMaterial, updateMaterial } from '../services/api';

const MaterialDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  useEffect(() => {
    if (isEdit && id && id !== 'undefined') {
      fetchMaterialDetail();
    }
  }, [id]);

  const fetchMaterialDetail = async () => {
    if (!id || id === 'undefined') {
      message.error('无效的材料ID');
      navigate('/material');
      return;
    }
    
    setLoading(true);
    try {
      const response = await getMaterial(id);
      form.setFieldsValue({
        name: response.data.name,
        price: response.data.price
      });
    } catch (error) {
      message.error('获取材料详情失败');
      console.error('获取材料详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const submitData = {
        name: values.name,
        price: parseFloat(values.price)
      };

      if (isEdit) {
        await updateMaterial(id, submitData);
        message.success('更新成功');
      } else {
        await createMaterial(submitData);
        message.success('创建成功');
      }
      navigate('/material');
    } catch (error) {
      message.error(`${isEdit ? '更新' : '创建'}失败`);
      console.error(`${isEdit ? '更新' : '创建'}失败:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title={isEdit ? '编辑材料信息' : '新增材料信息'} style={{ margin: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '', price: 0 }}
        >
          <Form.Item
            name="name"
            label="材料名称"
            rules={[{ required: true, message: '请输入材料名称' }]}
          >
            <Input placeholder="请输入材料名称" />
          </Form.Item>

          <Form.Item
            name="price"
            label="材料价格"
            rules={[{ required: true, message: '请输入材料价格' }]}
          >
            <Input type="number" placeholder="请输入材料价格" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '更新' : '创建'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/material')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default MaterialDetail; 