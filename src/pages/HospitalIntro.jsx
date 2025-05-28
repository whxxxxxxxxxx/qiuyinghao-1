import React from 'react';
import { Typography, Card, Row, Col, Divider, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import './HospitalIntro.css';

const { Title, Paragraph } = Typography;

const HospitalIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="hospital-intro">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>医院介绍</Title>
        <Space>
          <Button type="primary" onClick={() => navigate('/doctor')}>查看医生列表</Button>
        </Space>
      </div>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="医院简介" bordered={false}>
            <Paragraph>
            乐清市中医院，坐落于全国百强县乐清市市区东部，毗邻风景秀丽的东塔公园，是一所以中医药为主，中西医结合的二级甲等中医院，系乐清市中医医、教、研中心和中医重点建设县(市)的龙头单位。
医院占地面积约30亩，核定床位255张。现有高级卫技人员59人，拥有全国基层名老中医1名，浙江省级名中医1名，温州市级名中医1名，温州市中青年名中医1名，乐清市名中医7名。医院拥有全国基层名老中医倪永华传承工作室和杭州宣氏儿科学术流派传承工作站，现有省级重点专科1个(内分泌科)，温州市重点专科2个(脾胃病科、儿科)，温州市重点扶持专科1个(康复科)。
门诊开设中医内、外、妇、儿科、针灸、推拿科、眼科、骨伤科、康复科、肝病科、肾病科、肛肠科和皮肤科等;西医内、外、妇、儿、骨科、泌尿、性病、口腔科、五官科等;设置手术室、ICU、体检中心和血透中心等科室。医院现有五个病区，收治内、外、骨伤、肛肠、眼科、神志病科、康复、妇科和儿科等病人。医技科室有放射、检验、PCR实验室、B超、心电图、脑电图等，拥有磁共振、CT、DR、全自动生化分析仪、超声诊断仪、C臂机、电子内窥镜系统，自动发药机等高精尖医疗设备，还是乐清首个安装使用物流小车系统(沃伦韦尔Telesys智能轨道物流传输系统)的医院,为老百姓提供更加优质的医疗服务。
医院坚持“完善功能、发扬特色、中西并重、发展中医”的办院方向，注重内涵建设，遵循“突出中医药特色，走中西医结合道路，继承传统文化，一切为了患者康复“的办院宗旨，努力探索医疗卫生事业变革的发展之路            </Paragraph>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="医院特色" bordered={false}>
            <Paragraph>
              1. 先进的医疗设备<br />
              2. 专业的医疗团队<br />
              3. 全方位的健康服务<br />
              4. 便捷的就医流程
            </Paragraph>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="联系方式" bordered={false}>
            <Paragraph>
              地址：XX市XX区XX街XX号<br />
              电话：123-456-7890<br />
              邮箱：info@hospital.com
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HospitalIntro; 