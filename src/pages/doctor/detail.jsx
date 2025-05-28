import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Spin, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctor, createDoctor, updateDoctor, getDepartmentList } from '../../services/api';

const DoctorDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  useEffect(() => {
    fetchDepartments();
    if (isEdit && id && id !== 'undefined') {
      fetchDoctorDetail();
    }
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentList();
      setDepartments(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (e) {
      message.error('获取科室列表失败');
    }
  };

  const fetchDoctorDetail = async () => {
    setLoading(true);
    try {
      const res = await getDoctor(id);
      form.setFieldsValue({
        name: res.data.name,
        departmentId: res.data.departmentId || (res.data.department && res.data.department.ID),
      });
    } catch (e) {
      message.error('获取医生详情失败');
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
    } catch (e) {
      message.error(`${isEdit ? '更新' : '创建'}失败`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title={isEdit ? '编辑医生' : '新增医生'} style={{ margin: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: '', departmentId: undefined }}
        >
          <Form.Item
            name="name"
            label="医生姓名"
            rules={[{ required: true, message: '请输入医生姓名' }]}
          >
            <Input placeholder="请输入医生姓名" />
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="所属科室"
            rules={[{ required: true, message: '请选择所属科室' }]}
          >
            <Select placeholder="请选择所属科室">
              {departments.map(dep => (
                <Select.Option key={dep.ID} value={dep.ID}>{dep.name}</Select.Option>
              ))}
            </Select>
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