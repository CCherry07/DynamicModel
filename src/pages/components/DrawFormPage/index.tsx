import { formBuilder } from '@/builder/formBuilder';
import type { RequestParams } from '@/components/Modal';
import { finishFormAdaptor, setFieldsAdaptor } from '@/uitls';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, message, Row, Space, Spin, Tabs } from 'antd';
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
  const request = useRequest(
    (config: RequestParams) => {
      const { uri, method, ...formData } = config;
      return {
        url: baseUrl + uri,
        method,
        data: formData,
      };
    },
    {
      manual: true,
      onSuccess: (res) => {
        message.success({
          content: res.message,
          key: 'process',
        });
        history.goBack();
      },
      formatResult(res: any) {
        return res;
      },
    },
  );

  const [form] = useForm();

  useEffect(() => {
    if (!data) return;
    form.resetFields();
    form.setFieldsValue(setFieldsAdaptor(data));
  }, [data, form]);
  const onFinish = (values: RequestParams) => {
    request.run(finishFormAdaptor(values));
  };

  const actionHandler = (actionInfo: BasicPageDataApi.Action) => {
    console.log(actionInfo);
    switch (actionInfo.action) {
      case 'submit':
        form.setFieldsValue({
          uri: actionInfo.uri,
          method: actionInfo.method,
        });
        form.submit();
        break;
      case 'reset':
        form.resetFields();
        break;
      case 'cancel':
        history.goBack();
      default:
        break;
    }
  };

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
      {loading ? (
        <Spin style={{ width: '100%', height: '100%' }} size="large" spinning={true} />
      ) : (
        <div>
          <Row gutter={24}>
            <Col sm={16}>
              <Card>
                <Tabs type="card">
                  {data?.layout.tabs.map((tab) => {
                    return (
                      <Tabs.TabPane tab={tab.title} key={tab.title}>
                        <Form
                          form={form}
                          onFinish={onFinish}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 12 }}
                        >
                          {formBuilder(tab.data, hidfieldConfig)}
                          <Form.Item name="uri" key={'uri'} hidden>
                            <Input />
                          </Form.Item>
                          <Form.Item name="method" key={'method'} hidden>
                            <Input />
                          </Form.Item>
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
                  return <Space>{actionsBuilder(action.data, actionHandler)}</Space>;
                })}
              </Card>
            </Col>
          </Row>
          <FooterToolbar extra={extraConfig()}>
            {actionsBuilder(data?.layout.actions[0].data, actionHandler)}
          </FooterToolbar>
        </div>
      )}
    </PageContainer>
  );
};
