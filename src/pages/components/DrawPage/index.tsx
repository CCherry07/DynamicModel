import { formBuilder } from '@/builder/formBuilder';
import { setFieldsAdaptor } from '@/uitls';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Row, Space, Spin, Tabs } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect } from 'react';
import { useRequest, useLocation, history } from 'umi';
import { actionsBuilder } from '../../../builder/actionsBuilder';
export default () => {
  const location = useLocation();
  const baseUrl = 'https://public-api-v2.aspirantzhang.com';
  const initUrl = baseUrl + location.pathname.replace('/basic-list', '') + '?X-API-KEY=antd';
  const { data, loading } = useRequest<{ data: BasicPageDataApi.PageData }>(initUrl, {
    onError() {
      history.goBack();
    },
  });
  // const request = useRequest(
  //   (config: any) => {
  //     const { uri, method, ...formData } = config;
  //     return {
  //       url: baseUrl + uri,
  //       method,
  //       data: formData,
  //     };
  //   },
  //   {
  //     manual: true,
  //     onSuccess: (res) => {
  //       message.success({
  //         content: res.message,
  //         key: 'process',
  //       });
  //       history.goBack()
  //     },
  //     formatResult(res: any) {
  //       return res;
  //     },
  //   },
  // );
  const [form] = useForm();

  useEffect(() => {
    if (!data) return;
    form.resetFields();
    form.setFieldsValue(setFieldsAdaptor(data));
  }, [data, form]);

  const extraConfig = () => {
    const leftShowSlot = data?.dataSource?.update_time ? (
      <Button type="default" key={data?.dataSource.update_time}>
        {moment(data?.dataSource.update_time).format('YYYY/MM/DD HH-mm-ss')}
      </Button>
    ) : null;
    return leftShowSlot;
  };
  const hidfieldConfig = ['update_time'];
  return (
    <PageContainer>
      <Row gutter={24}>
        <Col sm={16}>
          <Card>
            <Tabs type="card">
              {data?.layout.tabs.map((tab) => {
                return (
                  <Tabs.TabPane tab={tab.title} key={tab.title}>
                    <Spin spinning={loading}>
                      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
                        {formBuilder(tab.data, hidfieldConfig)}
                        <Form.Item name="uri" key={'uri'} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item name="method" key={'method'} hidden>
                          <Input />
                        </Form.Item>
                      </Form>
                    </Spin>
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
      <FooterToolbar extra={extraConfig()}>
        {actionsBuilder(data?.layout.actions[0].data)}
      </FooterToolbar>
    </PageContainer>
  );
};
