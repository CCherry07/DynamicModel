import { Button, Space, Tag } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import type { ColumnType } from 'antd/lib/table/interface';
import moment from 'moment';
export const actionsBuilder = (
  actions: BasicPageDataApi.Action[],
  actionsHandler?: (actionInfo: BasicPageDataApi.Action) => void,
) => {
  return actions.map((action) => {
    if (action.component === 'button') {
      return (
        <Button
          key={action.text}
          type={action.type as ButtonType}
          onClick={() => actionsHandler?.(action)}
        >
          {action.text}
        </Button>
      );
    }
    return null;
  });
};

export const columnsBuilder = (
  tableColumn: BasicPageDataApi.Field[],
  actionsHandler?: (actionInfo: BasicPageDataApi.Action) => void,
) => {
  const columns: BasicPageDataApi.Field[] = [];
  tableColumn.forEach((column) => {
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
        column.render = () => {
          return (
            <Space> {actionsBuilder(column.actions || [], actionsHandler || undefined)} </Space>
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
