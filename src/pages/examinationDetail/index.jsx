import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Spin, Select, InputNumber } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getExamination, 
  createExamination, 
  updateExamination, 
  getDoctorList, 
  getExaminationItemList 
} from '../../services/api';

const { Option } = Select;

const ExaminationDetail = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [examinationItems, setExaminationItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  useEffect(() => {
    fetchDoctors();
    fetchExaminationItems();
    if (isEdit) {
      fetchExaminationDetail();
    }
  }, [id]);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctorList();
      // 确保 doctors 是一个数组
      setDoctors(Array.isArray(response.data) ? response.data : 
                (Array.isArray(response.data.data) ? response.data.data : []));
    } catch (error) {
      message.error('获取医生列表失败');
      console.error('获取医生列表失败:', error);
      // 确保在出错时 doctors 也是一个空数组
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
      message.error('获取检查项目列表失败');
      console.error('获取检查项目列表失败:', error);
      // 确保在出错时 examinationItems 也是一个空数组
      setExaminationItems([]);
    }
  };

  const fetchExaminationDetail = async () => {
    setLoading(true);
    try {
      const response = await getExamination(id);
      const examination = response.data;
      form.setFieldsValue({
        patientName: examination.patientName,
        examinationItemID: examination.examinationItemID,
        examinationCount: examination.examinationCount,
        totalAmount: examination.totalAmount,
        doctorID: examination.doctorID,
        costAllocationRate: examination.costAllocationRate,
      });
      
      // 设置选中的检查项目，用于计算总金额
      const item = examinationItems.find(i => i.id === examination.examinationItemID);
      if (item) {
        setSelectedItem(item);
      }
    } catch (error) {
      message.error('获取检查记录详情失败');
      console.error('获取检查记录详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (value) => {
    const item = examinationItems.find(i => i.ID === value || i.id === value);
    setSelectedItem(item);
    if (item) {
      // 更新总金额，兼容 price 和 amount 字段
      const count = form.getFieldValue('examinationCount') || 1;
      const itemPrice = item.price || item.amount || 0;
      form.setFieldsValue({ totalAmount: itemPrice * count });
    }
  };

  const handleCountChange = (value) => {
    if (selectedItem && value) {
      const itemPrice = selectedItem.price || selectedItem.amount || 0;
      form.setFieldsValue({ totalAmount: itemPrice * value });
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      console.log('提交的数据:', values); // 添加日志，查看提交的数据
      
      // 确保 ID 字段格式正确
      const submitData = {
        ...values,
        examinationItemID: Number(values.examinationItemID),
        doctorID: Number(values.doctorID),
        examinationCount: Number(values.examinationCount),
        totalAmount: Number(values.totalAmount),
        costAllocationRate: Number(values.costAllocationRate)
      };
      
      if (isEdit) {
        await updateExamination(id, submitData);
        message.success('更新成功');
      } else {
        await createExamination(submitData);
        message.success('创建成功');
      }
      navigate('/examination');
    } catch (error) {
      message.error(`${isEdit ? '更新' : '创建'}失败: ${error.message || '未知错误'}`);
      console.error(`${isEdit ? '更新' : '创建'}失败:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title={isEdit ? '编辑检查记录' : '新增检查记录'} style={{ margin: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ 
            patientName: '', 
            examinationCount: 1,
            totalAmount: 0,
            costAllocationRate: 0.5
          }}
        >
          <Form.Item
            name="patientName"
            label="病号"
            rules={[{ required: true, message: '请输入病号' }]}
          >
            <Input placeholder="请输入病号" />
          </Form.Item>

          <Form.Item
            name="examinationItemID"
            label="检查项目"
            rules={[{ required: true, message: '请选择检查项目' }]}
          >
            <Select 
              placeholder="请选择检查项目" 
              onChange={handleItemChange}
            >
              {Array.isArray(examinationItems) && examinationItems.map(item => (
                <Option key={item.ID || item.id} value={item.ID || item.id}>
                  {item.name} (¥{item.price || item.amount || 0})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="examinationCount"
            label="检查次数"
            rules={[{ required: true, message: '请输入检查次数' }]}
          >
            <InputNumber 
              min={1} 
              placeholder="请输入检查次数" 
              style={{ width: '100%' }}
              onChange={handleCountChange}
            />
          </Form.Item>

          <Form.Item
            name="totalAmount"
            label="总金额"
            rules={[{ required: true, message: '请输入总金额' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              placeholder="请输入总金额" 
              style={{ width: '100%' }}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="doctorID"
            label="开单医生"
            rules={[{ required: true, message: '请选择开单医生' }]}
          >
            <Select placeholder="请选择开单医生">
              {Array.isArray(doctors) && doctors.map(doctor => (
                <Option key={doctor.ID || doctor.id} value={doctor.ID || doctor.id}>
                  {doctor.name} ({doctor.department?.name || '-'})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="costAllocationRate"
            label="成本分配率"
            rules={[{ required: true, message: '请输入成本分配率' }]}
          >
            <InputNumber 
              min={0} 
              max={1} 
              step={0.01} 
              placeholder="请输入成本分配率" 
              style={{ width: '100%' }}
              formatter={value => `${value * 100}%`}
              parser={value => value.replace('%', '') / 100}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEdit ? '更新' : '创建'}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate('/examination')}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default ExaminationDetail;