declare module BasicPageDataApi {
  type Page = {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  };
  type Field = {
    render: (value: any) => string | ReactNode;
    title: string;
    dataIndex: string;
    key: string;
    type?: string;
    data?: Datum[];
    hideInColumn?: boolean;
    sorter?: boolean;
    mode?: string;
    actions?: Action[];
    [key in string]: any;
  };

  type ActionType = {
    component: string;
    text: string;
    type: string;
    action: string;
  };

  type Action = {
    component: string;
    text: string;
    type: string;
    action: string;
    uri?: string;
    method?: string;
    data?: ActionType[];
  };

  type Pivot = {
    id: number;
    admin_id: number;
    group_id: number;
    create_time: string;
    update_time: string;
    delete_time?: any;
    status: number;
  };

  type Group = {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    update_time: Date;
    delete_time?: any;
    status: number;
    pivot: Pivot;
  };

  type DataSource = {
    id: number;
    username: string;
    display_name: string;
    create_time: Date | string;
    delete_time: Date | string;
    status: number;
    groups: Group[];
  };

  type Meta = {
    total: number;
    per_page: number;
    page: number;
  };
  type ListLayout = {
    tableColumn: Field[];
    tableToolBar: Action[];
    batchToolBar: Action[];
  };
  type Tab = {
    name: string;
    title: string;
    data: Field[];
  };
  type PageLayout = {
    tabs: Tab[];
    actions: Action[];
  };

  type ListData = {
    page: Page;
    layout: ListLayout;
    dataSource: DataSource[];
    meta: Meta;
  };
  type PageData = {
    page: Page;
    layout: PageLayout;
    dataSource: DataSource;
  };
  type Root = {
    success: boolean;
    message: string;
    data: ListData | PageData;
  };
}
