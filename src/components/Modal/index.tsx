import { actionsBuilder } from '@/pages/BasicList/componentBuilder';
import { Form, Modal as AntdModal } from 'antd';
import { useEffect } from 'react';
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
  const { data, run } = useRequest<{ data: PageApi.Data }>(modalDataUrl);
  useEffect(() => {
    if (!props.visible) return;
    run();
  }, [props.visible, run]);
  return (
    <div>
      <AntdModal
        title={data?.page.title}
        visible={props.visible}
        onOk={handleOK}
        onCancel={handleCancel}
        footer={actionsBuilder(data?.layout.actions[0].data || [])}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          {modalFormBuilder(data?.layout.tabs[0].data || [])}
        </Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
