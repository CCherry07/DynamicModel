import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';

import { useRequest } from 'umi';

import { AfterTableLayout } from './components/AfterTableLayout';
import { BeforeTableLayout } from './components/BeforeTableLayout';
import { SearchLayout } from './components/SearchLayout';

import { columnsBuilder } from './componentBuilder';
import { Modal } from '@/components/Modal';

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
  const baseUrl = 'https://public-api-v2.aspirantzhang.com';
  const url = `${baseUrl}/api/admins?X-API-KEY=antd&page=${pageConfig.page}&per_page=${pageConfig.per_page}&sort=${pageConfig?.sort}&order=${pageConfig?.order}`;
  const [modalDataUrl, setModalDataUrl] = useState('');
  const { data, loading, run } = useRequest<{ data: BasicPageDataApi.ListData }>(url);

  const [visible, setVisible] = useState(false);
  const handleChange = (...args: any[]) => {
    const { field } = args[2];
    changeIsAsc(field && !isAsc);
    const orderConfig: Partial<PageConfig> = {
      order: isAsc ? 'desc' : 'asc',
      sort: field,
    };
    setPageConfig((state) => {
      return { ...state, ...orderConfig };
    });
  };
  useEffect(() => {
    run();
  }, [pageConfig, run]);

  const handlePageConfig = (page: number, pageSize: number) =>
    setPageConfig({ page, per_page: pageSize });

  const hidModal = ({ retry }: { retry?: boolean }) => {
    if (retry) {
      run();
      setVisible(false);
    }
    setVisible(false);
  };

  const actionsHandler = (actionInfo: BasicPageDataApi.Action, row?: any) => {
    switch (actionInfo.action) {
      case 'modal':
        const uri = actionInfo.uri?.replace(/:\w+/g, (felid) => {
          return row[felid.replace(':', '')];
        });
        setModalDataUrl(uri || '');
        setVisible(true);
        break;
      case 'cancel':
        setVisible(false);
      default:
        break;
    }
  };

  return (
    <PageContainer>
      <Card>
        <SearchLayout />
        <BeforeTableLayout
          setModalDataUrl={setModalDataUrl}
          setVisible={setVisible}
          actions={data?.layout.tableToolBar || []}
        />
        <Table
          rowKey={'id'}
          loading={loading}
          pagination={{
            total: data?.meta.total,
            current: data?.meta.page,
            pageSize: data?.meta.per_page,
            onChange: handlePageConfig,
          }}
          columns={columnsBuilder(data?.layout.tableColumn || [], actionsHandler)}
          onChange={handleChange}
          dataSource={data?.dataSource}
        />
        <AfterTableLayout />
      </Card>
      <Modal
        handleCancel={() => setVisible(false)}
        handleOK={() => setVisible(false)}
        title="basic"
        modalDataUrl={modalDataUrl}
        visible={visible}
        hidModal={hidModal}
      />
    </PageContainer>
  );
};
