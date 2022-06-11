import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import type { MenuDataItem } from '@ant-design/pro-layout/lib';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {
  currentUser as queryCurrentUser,
  currentMenu as queryCurrentMenu,
} from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { message } from 'antd';
import type { ResponseError } from 'umi-request';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  currentMenu?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchMenu?: () => Promise<MenuDataItem[] | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const fetchMenu = async () => {
    try {
      const msg = await queryCurrentMenu();
      return msg;
    } catch (error) {
      message.error('Get menu failed, please retry');
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const currentMenu = await fetchMenu();
    return {
      fetchUserInfo,
      fetchMenu,
      currentUser,
      currentMenu,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchMenu,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    menuDataRender: () => {
      return initialState?.currentMenu;
    },
    // 错误处理程序
    errorHandler: (error: ResponseError) => {
      switch (error.name) {
        case 'BizError':
          if (error.data.message) {
            message.error({
              content: error.data.message,
              key: 'process',
              duration: 20,
            });
          } else {
            message.error({
              content: 'Business Error, please try again.',
              key: 'process',
              duration: 20,
            });
          }
          break;
        case 'ResponseError':
          message.error({
            content: `${error.response.status} ${error.response.statusText}. Please try again.`,
            key: 'process',
            duration: 20,
          });
          break;
        case 'TypeError':
          message.error({
            content: `Network error. Please try again.`,
            key: 'process',
            duration: 20,
          });
          break;
        default:
          break;
      }

      throw error;
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
