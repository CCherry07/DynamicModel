import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';

import { useRequest } from 'umi';
import { AfterTableLayout } from './components/AfterTableLayout';
import { BeforeTableLayout } from './components/BeforeTableLayout';
import { SearchLayout } from './components/SearchLayout';

import { columnsBuilder } from './componentBuilder';

export interface PageConfig {
  page: number;
  per_page: number;
  sort?: string;
  order?: string;
}

export default () => {
  const [pageConfig, setPageConfig] = useState<PageConfig>({
    page: 1,
    per_page: 10,
    sort: 'id',
    order: 'asc',
  });
  const [isAsc, changeIsAsc] = useState(false);
  const url = `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${pageConfig.page}&per_page=${pageConfig.per_page}&sort=${pageConfig?.sort}&order=${pageConfig?.order}`;

  const { data, loading, run } = useRequest<{ data: BasicPageDataApi.Data }>(url);

  const handleChange = (...args: any[]) => {
    const { field } = args[2];
    changeIsAsc(field && !isAsc);
    const orderConfig: Partial<PageConfig> = {
      order: isAsc ? 'asc' : 'desc',
      sort: field,
    };
    setPageConfig((state) => {
      return { ...state, ...orderConfig };
    });
  };
  useEffect(() => {
    run();
  }, [pageConfig]);
  const handlePageConfig = (page: number, pageSize: number) =>
    setPageConfig({ page, per_page: pageSize });

  return (
    <PageContainer>
      <Card>
        <SearchLayout />
        <BeforeTableLayout actions={data?.layout.tableToolBar || []} />
        <Table
          rowKey={'id'}
          loading={loading}
          pagination={{
            total: data?.meta.total,
            current: data?.meta.page,
            pageSize: data?.meta.per_page,
            onChange: handlePageConfig,
          }}
          columns={columnsBuilder(data?.layout.tableColumn || [])}
          onChange={handleChange}
          dataSource={data?.dataSource}
        />
        <AfterTableLayout />
      </Card>
    </PageContainer>
  );
};
