import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';
import { useEffect, useState } from 'react';

import { useRequest } from 'umi';

import { AfterTableLayout } from './components/AfterTableLayout';
import { BeforeTableLayout } from './components/BeforeTableLayout';
import { SearchLayout } from './components/SearchLayout';
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
  const handlePageConfig = (page: number, pageSize: number): void =>
    setPageConfig({ page, per_page: pageSize });
  return (
    <PageContainer>
      <Card>
        <SearchLayout />
        <BeforeTableLayout />
        <Table
          loading={loading}
          pagination={{
            total: data?.meta.total,
            current: data?.meta.page,
            pageSize: data?.meta.per_page,
            onChange: handlePageConfig,
          }}
          columns={data?.layout?.tableColumn.filter((item) => {
            return item.hideInColumn !== true;
          })}
          dataSource={data?.dataSource}
        />
        <AfterTableLayout />
      </Card>
    </PageContainer>
  );
};
