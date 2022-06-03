import { Space, Tag } from 'antd';
import type { ColumnType } from 'antd/lib/table/interface';
import moment from 'moment';
import { actionsBuilder } from './actionsBuilder';

export const columnsBuilder = (
  tableColumn?: BasicPageDataApi.Field[],
  actionsHandler?: (actionInfo: BasicPageDataApi.Action, row?: Record<string, any>) => void,
) => {
  const columns: BasicPageDataApi.Field[] = [];
  (tableColumn || []).forEach((column) => {
    if (column.hideInColumn === true) return;
    switch (column.type) {
      case 'datetime':
        column.render = (value: any) => {
          return moment(value).format('YYYY-MM-DD HH-mm-ss');
        };
        break;
      case 'switch':
        column.render = (value: any) => {
          const option = column.data?.find((item) => item.value === value);
          return (
            <Tag key={value.id} color={value ? 'blue' : 'red'}>
              {option?.title}{' '}
            </Tag>
          );
        };
        break;
      case 'actions':
        column.render = (_, row: BasicPageDataApi.DataSource) => {
          return (
            <Space>
              {' '}
              {actionsBuilder(
                column.actions || [],
                actionsHandler || undefined,
                undefined,
                row,
              )}{' '}
            </Space>
          );
        };
        break;
      default:
        break;
    }
    columns.push(column);
  });
  const idColumn: ColumnType<BasicPageDataApi.DataSource> = {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    sorter: (rowA, rowB) => {
      return rowA.id - rowB.id;
    },
  };
  columns.unshift(idColumn as any);
  return columns;
};
