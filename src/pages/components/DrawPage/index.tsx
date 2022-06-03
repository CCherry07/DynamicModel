import { formBuilder } from '@/builder/formBuilder';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Form, Row, Space, Tabs } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useRequest, useLocation } from 'umi';
import { actionsBuilder } from '../../../builder/actionsBuilder';
export default () => {
  const location = useLocation();
  const baseUrl = 'https://public-api-v2.aspirantzhang.com';
  const initUrl = baseUrl + location.pathname.replace('/basic-list', '') + '?X-API-KEY=antd';
  const { data } = useRequest<{ data: BasicPageDataApi.PageData }>(initUrl);
  const [form] = useForm();
  console.log(data);

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col sm={16}>
          <Card>
            <Tabs type="card">
              {data?.layout.tabs.map((tab) => {
                return (
                  <Tabs.TabPane tab={tab.title} key={tab.title}>
                    <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                      {formBuilder(tab.data)}
                    </Form>
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </Card>
        </Col>
        <Col sm={8}>
          <Card style={{ textAlign: 'center' }}>
            {data?.layout.actions.map((action) => {
              return <Space>{actionsBuilder(action.data)}</Space>;
            })}
          </Card>
        </Col>
      </Row>
      <FooterToolbar> {actionsBuilder(data?.layout.actions[0].data)}</FooterToolbar>
    </PageContainer>
  );
};
