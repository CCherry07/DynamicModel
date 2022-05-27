import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card, Switch, Space } from 'antd';
import moment from 'moment';

import { useRequest } from 'umi';

import { AfterTableLayout } from './components/AfterTableLayout';
import { BeforeTableLayout } from './components/BeforeTableLayout';
import { SearchLayout } from './components/SearchLayout';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { actionsBuilder } from './component';
interface pageConfig {
  page: number;
  per_page: number;
}
export default () => {
  const [pageConfig, setPageConfig] = useState<pageConfig>({ page: 1, per_page: 10 });
  const url = `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${pageConfig.page}&per_page=${pageConfig.per_page}`;
  const { data, loading, run } = useRequest<{ data: BasicPageDataApi.Data }>(url);

  useEffect(() => {
    run();
  }, [pageConfig, run]);
  const handlePageConfig = (page: number, pageSize: number) =>
    setPageConfig({ page, per_page: pageSize });

  const columnsBuilder = () => {
    const columns: BasicPageDataApi.TableColumn[] = [];
    (data?.layout.tableColumn || []).forEach((column) => {
      if (column.hideInColumn === true) return;
      switch (column.type) {
        case 'datetime':
          column.render = (value: any) => {
            return moment(value).format('YYYY-MM-DD HH-mm-ss');
          };
          break;
        case 'switch':
          column.render = (value: any) => {
            // const checked = column.data?.some(item=>item.value === value)
            let checked: boolean = false;
            if (value === 1) {
              checked = true;
            }
            return (
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={checked}
              />
            );
          };
          break;
        case 'actions':
          column.render = () => {
            return <Space> {actionsBuilder(column.actions || [])} </Space>;
          };
          break;
        default:
          break;
      }
      columns.push(column);
    });
    return columns;
  };

  return (
    <PageContainer>
      <Card>
        <SearchLayout />
        <BeforeTableLayout actions={data?.layout.tableToolBar || []} />
        <Table
          loading={loading}
          pagination={{
            total: data?.meta.total,
            current: data?.meta.page,
            pageSize: data?.meta.per_page,
            onChange: handlePageConfig,
          }}
          columns={columnsBuilder()}
          dataSource={data?.dataSource}
        />
        <AfterTableLayout />
      </Card>
    </PageContainer>
  );
};
