import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { Button, Form, Input, message, Modal as AntdModal, Spin } from 'antd';
import moment from 'moment';
import { actionsBuilder } from '@/builder/actionsBuilder';
import { finishFormAdaptor, setFieldsAdaptor } from '@/uitls';
import { useForm } from 'antd/es/form/Form';
import { formBuilder } from '../../builder/formBuilder';
export interface ModalProps {
  title: string | ReactNode;
  visible: boolean;
  hidModal: ({ retry, isOpen }: { retry?: boolean; isOpen: boolean }) => void;
  handleOK: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  modalDataUrl: string;
  handleShowModalData?: (data: any) => void;
}
export interface RequestParams extends BasicPageDataApi.DataSource {
  uri?: string;
  method: string;
  password: string;
  'X-API-KEY'?: 'antd';
}
export const Modal = (props: ModalProps) => {
  const { modalDataUrl, handleOK, handleCancel, hidModal } = props;
  const baseUrl = 'https://public-api-v2.aspirantzhang.com';
  const initUrl = baseUrl + modalDataUrl + '?X-API-KEY=antd';
  const [form] = useForm();
  const {
    data,
    run,
    loading: formLoading,
  } = useRequest<{ data: BasicPageDataApi.PageData }>(initUrl, {
    manual: true,
    onError() {
      hidModal({ isOpen: false });
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
        hidModal({ retry: true, isOpen: false });
        message.success({
          content: res.message,
          key: 'process',
        });
      },
      formatResult(res: any) {
        return res;
      },
    },
  );
  //表单默认值
  const [initialValues, setInitialValues] = useState<any>({ status: true });
  useEffect(() => {
    if (!props.visible) return;
    form.resetFields();
    run();
  }, [props.visible, run, form]);
  //表单提交
  const onFinish = (values: RequestParams) => {
    request.run(finishFormAdaptor(values));
  };

  const actionHandler = (actionInfo: BasicPageDataApi.Action) => {
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
        hidModal({ isOpen: false });
      default:
        break;
    }
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    if (!data) return;
    form.resetFields();
    form.setFieldsValue(setFieldsAdaptor(data, setInitialValues));
  }, [data, form]);
  const footerConfig = () => {
    const leftShowSlot = data?.dataSource?.update_time ? (
      <Button
        type="default"
        style={{ position: 'absolute', left: '1rem' }}
        key={data?.dataSource.update_time}
      >
        {moment(data?.dataSource.update_time).format('YYYY/MM/DD HH-mm-ss')}
      </Button>
    ) : null;
    return [leftShowSlot].concat(
      actionsBuilder(data?.layout.actions[0]?.data, actionHandler, request.loading),
    );
  };

  const hidfieldConfig = ['update_time'];
  return (
    <div>
      <AntdModal
        title={data?.page.title}
        visible={props.visible}
        maskClosable={false}
        onOk={handleOK}
        onCancel={handleCancel}
        footer={footerConfig()}
      >
        <Spin spinning={formLoading}>
          <Spin spinning={request.loading}>
            <Form form={form} {...formLayout} onFinish={onFinish} initialValues={initialValues}>
              {formBuilder(data?.layout.tabs[0].data, hidfieldConfig)}
              <Form.Item name="uri" key={'uri'} hidden>
                <Input />
              </Form.Item>
              <Form.Item name="method" key={'method'} hidden>
                <Input />
              </Form.Item>
            </Form>
          </Spin>
        </Spin>
      </AntdModal>
    </div>
  );
};

export default Modal;
