declare module BasicPageDataApi {
  export interface Page {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  }

  export interface Action {
    component: string;
    text: string;
    type: string;
    action?: string;
    uri?: string;
    method?: string;
  }

  export interface Field {
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
  }

  export interface ActionType {
    component: string;
    text: string;
    type: string;
    action: string;
  }

  export interface Action {
    component: string;
    text: string;
    type: string;
    action: string;
    uri?: string;
    method?: string;
    data?: ActionType[];
  }

  export interface Pivot {
    id: number;
    admin_id: number;
    group_id: number;
    create_time: string;
    update_time: string;
    delete_time?: any;
    status: number;
  }

  export interface Group {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    update_time: Date;
    delete_time?: any;
    status: number;
    pivot: Pivot;
  }

  export interface DataSource {
    id: number;
    username: string;
    display_name: string;
    create_time: Date | string;
    delete_time: Date | string;
    status: number;
    groups: Group[];
  }

  export interface Meta {
    total: number;
    per_page: number;
    page: number;
  }
  export interface ListLayout {
    tableColumn: Field[];
    tableToolBar: Action[];
    batchToolBar: Action[];
  }
  export interface Tab {
    name: string;
    title: string;
    data: Field[];
  }
  export interface PageLayout {
    tabs: Tab[];
    actions: Action[];
  }

  export interface ListData {
    page: Page;
    layout: ListLayout;
    dataSource: DataSource[];
    meta: Meta;
  }
  export interface PageData {
    page: Page;
    layout: PageLayout;
    dataSource: DataSource;
  }
  export interface Root {
    success: boolean;
    message: string;
    data: ListData | PageData;
  }
}
