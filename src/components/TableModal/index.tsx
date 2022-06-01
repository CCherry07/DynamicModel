import { columnsBuilder } from '@/pages/BasicList/componentBuilder';
import { Button, Modal, Spin, Table } from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
import type { ModalProps } from '../Modal';
type BatchOverViewProps = {
  loading: boolean;
  tableColumn?: any[];
  rowSelection?: TableRowSelection<any>;
  dataSource?: readonly any[];
};
type TableModalProps = {
  tabmodalVisible: boolean;
  loading: boolean;
} & BatchOverViewProps &
  Omit<ModalProps, 'visible' | 'modalDataUrl'>;

export const BatchOverView = (props: BatchOverViewProps) => {
  const { tableColumn, rowSelection, dataSource, loading } = props;
  return (
    <Spin spinning={loading}>
      <Table
        size="small"
        rowKey={'id'}
        columns={columnsBuilder(tableColumn)}
        rowSelection={rowSelection}
        dataSource={dataSource}
      />
    </Spin>
  );
};
export const TableModal = (props: TableModalProps) => {
  const { handleCancel, handleOK, title, loading } = props;
  return (
    <Modal
      title={title}
      onOk={handleOK}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOK}>
          Submit
        </Button>,
      ]}
      visible={props.tabmodalVisible}
    >
      <BatchOverView {...props} />,
    </Modal>
  );
};
