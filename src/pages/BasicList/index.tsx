import { useEffect, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Table, Card, Modal as AntdModal, Space, message } from 'antd';
import { history, useRequest, useLocation } from 'umi';
import { useToggle, useUpdateEffect } from 'ahooks';
import { stringify } from 'query-string';

import { actionsBuilder } from '../../builder/actionsBuilder';
import { columnsBuilder } from '@/builder/columnsBuilder';

import { AfterTableLayout } from '../components/Layout/AfterTableLayout';
import { BeforeTableLayout } from '../components/Layout/BeforeTableLayout';
import { SearchLayout } from '../components/Layout/SearchLayout';

import { Modal } from '@/components/Modal';
import { Mark } from '@/components/Mark';
import { TableModal } from '@/components/TableModal';

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
  const location = useLocation();
  const url = `${location.pathname.replace('/basic-list', '')}?page=${pageConfig.page}
              &per_page=${pageConfig.per_page}&sort=${pageConfig?.sort}
              &order=${pageConfig?.order}`;
  const [modalDataUrl, setModalDataUrl] = useState('');
  const [actionMessage, setActionMessage] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [isSearch, setIsSearch] = useToggle(false);
  const { data, loading, run } = useRequest<{ data: BasicPageDataApi.ListData }>(
    (config) => {
      return {
        url,
        params: config,
        paramsSerializer: (params: any) => {
          return stringify(params, { arrayFormat: 'comma', skipEmptyString: true, skipNull: true });
        },
      };
    },
    {
      // 成功后，清理checklist
      onSuccess: () => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      },
    },
  );
  type RequestConfig = {
    uri: string;
    method: string;
    [key: string]: any;
  };
  const hidModal = ({ retry, isOpen }: { retry?: boolean; isOpen: boolean }) => {
    setModalDataUrl('');
    if (retry) {
      run();
    }
    setTableVisible(isOpen);
    setVisible(isOpen);
  };
  const request = useRequest(
    (config: RequestConfig) => {
      const { uri, method, ...formData } = config;
      return {
        url: uri,
        method,
        data: formData,
      };
    },
    {
      manual: true,
      throttleInterval: 1000,
      onSuccess: (res: BasicPageDataApi.Root) => {
        message.success({
          content: res.message,
          key: 'process',
        });
        // 删除和操作更新后重新获取数据
        run();
        hidModal({ isOpen: false, retry: true });
      },
      onError: () => {
        hidModal({ isOpen: false });
      },
      formatResult(res: any) {
        return res;
      },
    },
  );

  useUpdateEffect(() => {
    run();
  }, [pageConfig, run, location.pathname]);

  useEffect(() => {
    if (!modalDataUrl) return;
    setVisible(true);
  }, [modalDataUrl]);

  useEffect(() => {
    // todo search
  }, [isSearch]);

  const handlePageConfig = (page: number, pageSize: number) =>
    setPageConfig({ page, per_page: pageSize });
  const confirmDeleteAdmin = (
    row: BasicPageDataApi.DataSource,
    actionInfo: BasicPageDataApi.Action,
  ) => {
    AntdModal.confirm({
      title: (
        <Mark
          keywordSize="1.5rem"
          target={`确定要删除<${row.username}>管理员吗？`}
          keyword={`<${row.username}>`}
        />
      ),
      content: `点击确定删除 <${row.username}>`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return request
          .run({
            uri: actionInfo.uri || '',
            method: 'post',
            type: actionInfo.type,
            ids: [row.id],
          })
          .catch(() => Promise.resolve(true));
      },
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
        break;
      case 'delete':
      case 'deletePermanently':
      case 'restore':
        // TODO del prams
        if (actionInfo.type === 'danger') {
          // 批量删除
          setActionMessage(actionInfo);
          setTableVisible(true);
          return;
        }
        confirmDeleteAdmin(row, actionInfo);
        break;
      case 'page':
        const pageEdituri =
          '/basic-list' +
          actionInfo.uri?.replace(/:\w+/g, (felid) => {
            return row[felid.replace(':', '')];
          });
        history.push(pageEdituri);
        break;
      default:
        break;
    }
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

  const handleTabOK = (actionInfo: BasicPageDataApi.Action) => {
    return () => {
      request
        .run({
          uri: actionInfo.uri || '',
          method: 'post',
          type: 'delete',
          ids: selectedRowKeys,
        })
        .finally(() => setSelectedRowKeys([]));
    };
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (_selectedRowKeys: any[], _selectedRows: any[]) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedRows(_selectedRows);
    },
  };
  const FooterToolbarRedender = () => {
    return selectedRowKeys.length ? (
      <Space>{actionsBuilder(data?.layout.batchToolBar || [], actionsHandler)}</Space>
    ) : null;
  };
  return (
    <PageContainer>
      <Card>
        <SearchLayout
          fields={data?.layout.tableColumn}
          isSearch={isSearch}
          setIsSearch={setIsSearch}
          run={run}
        />
        <BeforeTableLayout
          pageReload={run}
          isSearch={isSearch}
          setModalDataUrl={setModalDataUrl}
          setIsSearch={setIsSearch}
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
      <TableModal
        title={
          <Mark
            target={`将要删除以下${selectedRows[0]?.username}等管理员？`}
            keyword={selectedRows[0]?.username}
          />
        }
        hidModal={hidModal}
        loading={request.loading}
        handleCancel={() => hidModal({ isOpen: false })}
        handleOK={handleTabOK(actionMessage)}
        rowSelection={rowSelection}
        dataSource={selectedRows}
        tabmodalVisible={tableVisible}
        tableColumn={data?.layout.tableColumn.slice(0, 3)}
      />
      <FooterToolbar renderContent={FooterToolbarRedender} />
    </PageContainer>
  );
};
