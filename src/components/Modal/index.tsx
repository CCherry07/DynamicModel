import { actionsBuilder } from '@/pages/BasicList/componentBuilder';
import { Form, Modal as AntdModal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { modalFormBuilder } from './ModalFormBuilder';
interface ModalProps {
  title: string;
  visible: boolean;
  handleOK: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  handleCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  modalDataUrl: string;
  handleShowModalData?: (data: any) => void;
}
export const Modal = (props: ModalProps) => {
  const { handleOK, handleCancel, modalDataUrl } = props;
  const [form] = useForm();
  const { data, run } = useRequest<{ data: PageApi.Data }>(modalDataUrl);

  const [initialValues, setInitialValues] = useState<any>({ status: true });
  useEffect(() => {
    if (!props.visible) return;
    form.resetFields();
    run();
  }, [props.visible, run]);

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

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue(setFieldsAdaptor(data));
  }, [data]);
  return (
    <div>
      <AntdModal
        title={data?.page.title}
        visible={props.visible}
        maskClosable={false}
        onOk={handleOK}
        onCancel={handleCancel}
        footer={actionsBuilder(data?.layout.actions[0].data || [])}
      >
        <Form form={form} {...formLayout} initialValues={initialValues}>
          {modalFormBuilder(data?.layout.tabs[0].data || [])}
        </Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
