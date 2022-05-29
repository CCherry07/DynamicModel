import { actionsBuilder } from '@/pages/BasicList/componentBuilder';
import { finishFormAdaptor, setFieldsAdaptor } from '@/uitls';
import { Form, Input, message, Modal as AntdModal, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { modalFormBuilder } from './ModalFormBuilder';
interface ModalProps {
  title: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleOK: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  modalDataUrl: string;
  handleShowModalData?: (data: any) => void;
}
interface RequestParams extends BasicPageDataApi.DataSource {
  uri?: string;
  method: string;
  password: string;
  'X-API-KEY'?: 'antd';
}
export const Modal = (props: ModalProps) => {
  const { modalDataUrl, handleOK, handleCancel, setVisible } = props;
  const baseUrl = 'https://public-api-v2.aspirantzhang.com';
  const initUrl = baseUrl + modalDataUrl + '?X-API-KEY=antd';
  const [form] = useForm();
  const { data, run } = useRequest<{ data: BasicPageDataApi.PageData }>(initUrl, {
    manual: true,
    onError() {
      setVisible(false);
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
        setVisible(false);
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
        setVisible(false);
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
  return (
    <div>
      <AntdModal
        title={data?.page.title}
        visible={props.visible}
        maskClosable={false}
        onOk={handleOK}
        onCancel={handleCancel}
        footer={actionsBuilder(data?.layout.actions[0]?.data || [], actionHandler, request.loading)}
      >
        <Spin spinning={request.loading}>
          <Form form={form} {...formLayout} onFinish={onFinish} initialValues={initialValues}>
            {modalFormBuilder(data?.layout.tabs[0].data || [])}
            <Form.Item name="uri" key={'uri'} hidden>
              <Input />
            </Form.Item>
            <Form.Item name="method" key={'method'} hidden>
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </AntdModal>
    </div>
  );
};

export default Modal;
