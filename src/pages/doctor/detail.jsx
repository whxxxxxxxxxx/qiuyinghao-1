import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctor, createDoctor, updateDoctor } from '../../services/api';

const DoctorDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  // 修改判断逻辑，确保当 id 为 'new' 时不会进入编辑模式
  const isEdit = id && id !== 'new';

  useEffect(() => {
    if (isEdit && id && id !== 'undefined') {
      fetchDoctorDetail();
    }
  }, [id]);

  const fetchDoctorDetail = async () => {
    if (!id || id === 'undefined') {
      message.error('无效的医生ID');
      navigate('/doctor');
      return;
    }
    
    setLoading(true);
    try {
      const response = await getDoctor(id);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('获取医生详情失败');
      console.error('获取医生详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateDoctor(id, values);
        message.success('更新成功');
      } else {
        await createDoctor(values);
        message.success('创建成功');
      }
      navigate('/doctor');
    } catch (error) {
      message.error(`${isEdit ? '更新' : '创建'}失败`);
      console.error(`${isEdit ? '更新' : '创建'}失败:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title={isEdit ? '编辑医生信息' : '新增医生信息'} style={{ margin: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '', department: '' }}
        >
          <Form.Item
            name="name"
            label="医生姓名"
            rules={[{ required: true, message: '请输入医生姓名' }]}
          >
            <Input placeholder="请输入医生姓名" />
          </Form.Item>

          <Form.Item
            name="department"
            label="科室"
            rules={[{ required: true, message: '请输入科室' }]}
          >
            <Input placeholder="请输入科室" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '更新' : '创建'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/doctor')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default DoctorDetail;