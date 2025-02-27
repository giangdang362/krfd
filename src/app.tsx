import avatarImg from '@/../public/images/avatar-default.png';
import { AvatarDropdown, AvatarName, SelectLang } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { RequestConfig, RunTimeLayoutConfig, history } from '@umijs/max';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { getSessionStorageUser, getStorageUser } from './utils/auth';
import { getUrlImage } from './utils/media';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  currentUser?: API.User;
  settings?: Partial<LayoutSettings>;
}> {
  const storageUser = getStorageUser();
  const sessionStorageUser = getSessionStorageUser();
  const currentUser = sessionStorageUser || storageUser;
  return {
    currentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}
// x
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    actionsRender: () => {
      return [<SelectLang key="SelectLang" />];
    },
    avatarProps: {
      src: initialState?.currentUser?.avatarFileName?.length
        ? getUrlImage(initialState?.currentUser?.avatarFileName)
        : avatarImg,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    headerTitleRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      type ThemeData = {
        borderRadius: number;
        colorPrimary: string;
        Button?: {
          colorPrimary: string;
          algorithm?: boolean;
        };
      };

      // Customize primary_color
      const defaultData: ThemeData = {
        borderRadius: 6,
        colorPrimary: '#EF488E',
        Button: {
          colorPrimary: '#EF488E',
        },
      };
      return (
        <>
          {/* Add ConfigProvider to override css default of Antd */}
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: defaultData.colorPrimary,
                borderRadius: defaultData.borderRadius,
              },
              components: {
                Button: {
                  colorPrimary: defaultData.Button?.colorPrimary,
                  algorithm: defaultData.Button?.algorithm,
                },
                Progress: {
                  // can not apply primary color of progress
                  colorPrimaryBg: defaultData.Button?.colorPrimary,
                },
              },
            }}
            locale={enUS}
          >
            {children}
          </ConfigProvider>
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */

export const request: RequestConfig = {
  baseURL: API_URL || 'http://20.39.186.253:9000',
  ...errorConfig,
};
