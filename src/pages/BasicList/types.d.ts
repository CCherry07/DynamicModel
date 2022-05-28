declare module BasicPageDataApi {
  export interface Page {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  }

  export interface Child2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
  }

  export interface Child {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
    children: Child2[];
  }

  export interface Datum {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: any;
    title: string;
    depth: number;
    children: Child[];
  }

  export interface Action {
    component: string;
    text: string;
    type: string;
    action?: string;
    uri?: string;
    method?: string;
  }

  export interface TableColumn {
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

  export interface TableToolBar {
    component: string;
    text: string;
    type: string;
    action: string;
    id: string;
    uri: string;
  }

  export interface BatchToolBar {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface Layout {
    tableColumn: TableColumn[];
    tableToolBar: TableToolBar[];
    batchToolBar: BatchToolBar[];
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
    create_time: Date;
    delete_time?: any;
    status: number;
    groups: Group[];
  }

  export interface Meta {
    total: number;
    per_page: number;
    page: number;
  }

  export interface Data {
    page: Page;
    layout: Layout;
    dataSource: DataSource[];
    meta: Meta;
  }

  export interface RootObject {
    success: boolean;
    message: string;
    data: Data;
  }
}

// modal
declare module PageApi {
  export interface Page {
    title: string;
    type: string;
  }

  export interface Child2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
  }

  export interface Child {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
    children: Child2[];
  }

  export interface Datum2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
    children: Child[];
  }

  export interface Datum {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    disabled: boolean;
    data: Datum2[];
  }

  export interface Tab {
    name: string;
    title: string;
    data: Datum[];
  }

  export interface Datum3 {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface Action {
    name: string;
    title: string;
    data: Datum3[];
  }

  export interface Layout {
    tabs: Tab[];
    actions: Action[];
  }

  export interface DataSource {
    id: number;
    username: string;
    display_name: string;
    create_time: Date;
    update_time: Date;
    status: number;
    groups: number[];
  }

  export interface Data {
    page: Page;
    layout: Layout;
    dataSource: DataSource;
  }

  export interface RootObject {
    success: boolean;
    message: string;
    data: Data;
  }
}
