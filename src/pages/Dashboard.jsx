import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import { getDashboardSummary } from '../services/api';
import { AppstoreOutlined, UserOutlined, TeamOutlined, DollarOutlined, LineChartOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import ReactECharts from 'echarts-for-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getDashboardSummary();
      setData(res.data || {});
    } catch (e) {
      message.error('获取看板数据失败');
    } finally {
      setLoading(false);
    }
  };

  // mock趋势图数据
  const lineData = [
    { date: '2025-05-23', 门诊量: 120, 收入: 50000, 材料消耗: 8000 },
    { date: '2025-05-24', 门诊量: 130, 收入: 52000, 材料消耗: 8500 },
    { date: '2025-05-25', 门诊量: 110, 收入: 48000, 材料消耗: 7800 },
    { date: '2025-05-26', 门诊量: 140, 收入: 55000, 材料消耗: 9000 },
    { date: '2025-05-27', 门诊量: 150, 收入: 60000, 材料消耗: 9500 },
    { date: '2025-05-28', 门诊量: 160, 收入: 62000, 材料消耗: 10000 },
    { date: '2025-05-29', 门诊量: 170, 收入: 65000, 材料消耗: 11000 },
  ];
  const lineConfig = {
    data: [
      ...lineData.map(d => ({ date: d.date, type: '门诊量', value: d.门诊量 })),
      ...lineData.map(d => ({ date: d.date, type: '收入', value: d.收入 })),
      ...lineData.map(d => ({ date: d.date, type: '材料消耗', value: d.材料消耗 })),
    ],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    height: 300,
    color: ['#1890ff', '#52c41a', '#faad14'],
    legend: { position: 'top' },
    yAxis: { label: { formatter: (v) => `${Number(v).toLocaleString()}` } },
    tooltip: { formatter: (datum) => ({ name: datum.type, value: datum.value }) },
  };

  // mock饼图数据
  const pieData = [
    { value: 320, name: '神经内科' },
    { value: 210, name: '外科' },
    { value: 180, name: '儿科' },
    { value: 150, name: '妇产科' },
    { value: 120, name: '骨科' },
  ];
  const pieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      top: 'bottom',
    },
    series: [
      {
        name: '门诊量',
        type: 'pie',
        radius: '60%',
        data: pieData,
        label: {
          formatter: '{b}: {d}%'
        }
      }
    ]
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 24 }}>医院运营看板</h1>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="医生数量" value={data.doctorCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="科室数量" value={data.departmentCount} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="今日门诊量" value={data.todayVisitCount} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="本月门诊量" value={data.monthVisitCount} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="今日收入" value={data.todayIncome} prefix={<DollarOutlined />} precision={2} suffix="元" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="本月收入" value={data.monthIncome} prefix={<DollarOutlined />} precision={2} suffix="元" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="今日材料消耗" value={data.todayMaterialCost} prefix={<LineChartOutlined />} precision={2} suffix="元" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered loading={loading}>
            <Statistic title="本月材料消耗" value={data.monthMaterialCost} prefix={<LineChartOutlined />} precision={2} suffix="元" />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={16}>
          <Card title="近7天运营趋势" bordered style={{ height: 380 }}>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="本月各科室门诊量占比" bordered style={{ height: 380 }}>
            <ReactECharts option={pieOption} style={{ height: 320 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 