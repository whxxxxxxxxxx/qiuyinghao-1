import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getDepartment, createDepartment, updateDepartment } from '../services/api';

const DepartmentDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  useEffect(() => {
    if (isEdit && id && id !== 'undefined') {
      fetchDepartmentDetail();
    }
  }, [id]);

  const fetchDepartmentDetail = async () => {
    setLoading(true);
    try {
      const res = await getDepartment(id);
      form.setFieldsValue({
        name: res.data.name,
        description: res.data.description
      });
    } catch (e) {
      message.error('获取科室详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateDepartment(id, values);
        message.success('更新成功');
      } else {
        await createDepartment(values);
        message.success('创建成功');
      }
      navigate('/department');
    } catch (e) {
      message.error(`${isEdit ? '更新' : '创建'}失败`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title={isEdit ? '编辑科室' : '新增科室'} style={{ margin: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '', description: '' }}
        >
          <Form.Item
            name="name"
            label="科室名称"
            rules={[{ required: true, message: '请输入科室名称' }]}
          >
            <Input placeholder="请输入科室名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="科室介绍"
            rules={[{ required: true, message: '请输入科室介绍' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入科室介绍" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '更新' : '创建'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/department')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default DepartmentDetail; 