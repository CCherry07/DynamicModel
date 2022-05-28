import { actionsBuilder } from '@/pages/BasicList/componentBuilder';
import { Form, Input, Modal as AntdModal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
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
interface RequestParams {
  uri?: string;
  method: string;
  username: string;
  password: string;
  display_name?: string;
  groups?: number[];
  create_time: string;
  update_time: string;
  status: boolean;
  'X-API-KEY'?: 'antd';
}
export const Modal = (props: ModalProps) => {
  const { handleOK, handleCancel, modalDataUrl, setVisible } = props;
  const [form] = useForm();
  const { data, run } = useRequest<{ data: PageApi.Data }>(modalDataUrl);
  const request = useRequest(
    (config: RequestParams) => {
      const { uri, method, ...formData } = config;
      return {
        url: `https://public-api-v2.aspirantzhang.com${uri}`,
        method,
        data: formData,
      };
    },
    {
      manual: true,
    },
  );
  const [initialValues, setInitialValues] = useState<any>({ status: true });
  useEffect(() => {
    if (!props.visible) return;
    form.resetFields();
    run();
  }, [props.visible, run, form]);

  const onFinish = (values: RequestParams) => {
    values.create_time = moment(values.create_time).format();
    values.update_time = moment(values.update_time).format();
    request.run({ ...values, 'X-API-KEY': 'antd' }).then(() => setVisible(false));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setFieldsAdaptor = (data: PageApi.Data) => {
    if (!data.layout.tabs) return {};
    const adaptored = { ...(data.dataSource || {}) };
    data.layout.tabs.forEach(({ data: fields }) => {
      fields.forEach((field) => {
        if (field.type === 'datetime') {
          adaptored[field.key] = moment(adaptored[field.key]);
          setInitialValues((state: any) => {
            return { ...state, [field.key]: moment() };
          });
        }
      });
    });
    return adaptored;
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
      case 'rest':

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
    form.setFieldsValue(setFieldsAdaptor(data));
  }, [data, form]);
  return (
    <div>
      <AntdModal
        title={data?.page.title}
        visible={props.visible}
        maskClosable={false}
        onOk={handleOK}
        onCancel={handleCancel}
        footer={actionsBuilder(data?.layout.actions[0].data || [], actionHandler)}
      >
        <Form form={form} {...formLayout} onFinish={onFinish} initialValues={initialValues}>
          {modalFormBuilder(data?.layout.tabs[0].data || [])}
          <Form.Item name="uri" key={'uri'} hidden>
            <Input />
          </Form.Item>
          <Form.Item name="method" key={'method'} hidden>
            <Input />
          </Form.Item>
        </Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
