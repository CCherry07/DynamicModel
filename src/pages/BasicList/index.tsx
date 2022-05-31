import { useEffect, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Table, Card, Modal as antdModal, Space } from 'antd';
import { useRequest } from 'umi';

import { AfterTableLayout } from './components/AfterTableLayout';
import { BeforeTableLayout } from './components/BeforeTableLayout';
import { SearchLayout } from './components/SearchLayout';

import { actionsBuilder, columnsBuilder } from './componentBuilder';
import { Modal } from '@/components/Modal';
import { Mark } from '@/components/Mark';

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

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    // selectedRows: any
    onChange: (_selectedRowKeys: any[], _selectedRows: any[]) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedRows(_selectedRows);
    },
  };

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

  const hidModal = ({ retry, isOpen }: { retry?: boolean; isOpen: boolean }) => {
    if (retry) {
      run();
    }
    setVisible(isOpen);
  };
  const confirmDeleteAdmin = (info: BasicPageDataApi.DataSource) => {
    antdModal.confirm({
      // title: `确定要删除<${info.username}>管理员吗？`,
      title: (
        <Mark
          keywordSize="1.5rem"
          target={`确定要删除<${info.username}>管理员吗？`}
          keyword={`<${info.username}>`}
        />
      ),
      content: `点击确定删除 <${info.username}>`,
      okText: '确定',
      cancelText: '取消',
      // onOk() {
      //   deleteProject({ id })
      // }
    });
  };

  const BatchOverView = ({ dataSource }: { dataSource: any[] }) => {
    const tableColumn = data?.layout.tableColumn.slice(0, 3) || [];
    return (
      <Table
        size="small"
        rowKey={'id'}
        loading={loading}
        columns={columnsBuilder(tableColumn)}
        onChange={handleChange}
        rowSelection={rowSelection}
        dataSource={dataSource}
      />
    );
  };

  const confirmDeleteRows = () => {
    antdModal.confirm({
      title: (
        <Mark
          keywordSize="1.5rem"
          target={`确定要删除<${selectedRows[0].username}>等管理员吗？`}
          keyword={`<${selectedRows[0].username}>`}
        />
      ),
      content: <BatchOverView dataSource={selectedRows} />,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {},
    });
  };

  const actionsHandler = (actionInfo: BasicPageDataApi.Action, row?: any) => {
    console.log(actionInfo);
    switch (actionInfo.action) {
      case 'modal':
        const uri = actionInfo.uri?.replace(/:\w+/g, (felid) => {
          return row[felid.replace(':', '')];
        });
        setModalDataUrl(uri || '');
        setVisible(true);
        break;
      case 'delete':
        // TODO del prams
        if ((actionInfo.type = 'danger')) {
          // 批量删除
          confirmDeleteRows();
          return;
        }
        confirmDeleteAdmin(row);
        break;
      case 'page':
        //TODO page action
        // setVisible(true);
        break;
      default:
        break;
    }
  };
  {
    /* <Space>{actionsBuilder(data?.layout.batchToolBar || [], actionsHandler)}</Space> */
  }

  const FooterToolbarRedender = () => {
    return selectedRowKeys.length ? (
      <Space>{actionsBuilder(data?.layout.batchToolBar || [], actionsHandler)}</Space>
    ) : null;
  };
  return (
    <PageContainer>
      <Card>
        <SearchLayout />
        <BeforeTableLayout
          pageReload={run}
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
          rowSelection={rowSelection}
          dataSource={data?.dataSource}
        />
        <AfterTableLayout />
      </Card>
      <Modal
        handleCancel={() => hidModal({ isOpen: false })}
        handleOK={() => hidModal({ isOpen: false })}
        title="basic"
        modalDataUrl={modalDataUrl}
        visible={visible}
        hidModal={hidModal}
      />
      <FooterToolbar renderContent={FooterToolbarRedender} />
    </PageContainer>
  );
};
