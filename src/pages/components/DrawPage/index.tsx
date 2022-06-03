import { formBuilder } from '@/builder/formBuilder';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Space, Tabs } from 'antd';
import { useRequest, useLocation } from 'umi';
import { actionsBuilder } from '../../../builder/actionsBuilder';
export default () => {
  const location = useLocation();
  const baseUrl = 'https://public-api-v2.aspirantzhang.com';
  const initUrl = baseUrl + location.pathname.replace('/basic-list', '') + '?X-API-KEY=antd';
  const { data } = useRequest<{ data: BasicPageDataApi.PageData }>(initUrl);
  console.log(actionsBuilder(data?.layout.actions));

  return (
    <PageContainer>
      <Row gutter={24}>
        <Col sm={16}>
          <Card>
            <Tabs type="card">
              <Tabs.TabPane tab={data?.page.title} key={1}>
                {formBuilder(data?.layout.tabs[0].data)}
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col sm={8}>
          <Card>
            <Space>{actionsBuilder(data?.layout.actions[0].data)}</Space>
          </Card>
        </Col>
      </Row>
      <FooterToolbar> footer </FooterToolbar>
    </PageContainer>
  );
};
