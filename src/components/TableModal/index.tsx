import { columnsBuilder } from '@/pages/BasicList/componentBuilder';
import { Button, Modal, Spin, Table } from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import type { ModalProps } from '../Modal';
type BatchOverViewProps = {
  loading: boolean;
  tabmodalVisible: boolean;
  tableColumn?: any[];
  hidModal: ({ isOpen, retry }: { isOpen: boolean; retry?: boolean | undefined }) => void;
  rowSelection?: TableRowSelection<any>;
  dataSource?: readonly any[];
};
type TableModalProps = {
  tabmodalVisible: boolean;
  loading: boolean;
} & BatchOverViewProps &
  Omit<ModalProps, 'visible' | 'modalDataUrl'>;
export const TableModal = (props: TableModalProps) => {
  const {
    dataSource,
    rowSelection,
    tabmodalVisible,
    tableColumn,
    handleCancel,
    handleOK,
    title,
    loading,
  } = props;
  const [ownDataSource, setownDataSource] = useState(dataSource);
  useEffect(() => {
    setownDataSource(dataSource);
  }, [tabmodalVisible]);
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
      <Spin spinning={loading}>
        <Table
          size="small"
          rowKey={'id'}
          columns={columnsBuilder(tableColumn)}
          rowSelection={rowSelection}
          dataSource={ownDataSource}
        />
      </Spin>
    </Modal>
  );
};
