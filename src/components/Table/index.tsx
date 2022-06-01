import type { TablePaginationConfig } from 'antd';
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import type { TableRowSelection } from 'antd/lib/table/interface';

export type FactoryTableProps = {
  rowId: string;
  loading: boolean;
  columns: ColumnsType<any> | undefined;
  pagination?: false | TablePaginationConfig | undefined;
  onChange: (selectedRowKeys: number[] | string[], selectedRows: any) => void;
  rowSelection: TableRowSelection<any> | undefined;
  dataSource: readonly any[] | undefined;
};
export const FactoryTable = (props: TableProps<any>) => {
  return <Table {...(props as any)} />;
};
