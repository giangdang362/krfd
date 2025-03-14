﻿import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message, notification } from 'antd';
import type { RequestOptionsInit } from 'umi-request';
import { getToken, removeToken } from './utils/auth';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

const loginPath = '/user/login';

const inRefreshToken = async (response: Response) => {
  const {
    status,
    // options
  } = response;
  if (status === 401) {
    // try {
    //   const auth = getToken();
    //   const data = await refreshToken({
    //     refreshToken: auth.refreshToken,
    //   });
    //   if (data.refreshToken && data.accessToken) {
    //     setToken(data);
    //     return requestUmi(response.url, {
    //       ...options,
    //       headers: {
    //         ...options.headers,
    //         headers: {
    //           Authorization: `Bearer ${data.accessToken}`,
    //         },
    //       },
    //     });
    //   } else {
    //     removeToken();
    //     history.push(loginPath);
    //   }
    // } catch (e) {
    //   removeToken();
    //   history.push(loginPath);
    // }
    removeToken();
    history.push(loginPath);
  }
  return Promise.resolve(response);
};

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const authData = getToken();
  const token = authData?.accessToken;
  const headers =
    options.requestType !== 'form'
      ? {
          url,
          options: {
            ...options,
            interceptors: true,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          },
        }
      : {
          url,
          options: {
            ...options,
            interceptors: true,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${token}`,
            },
          },
        };

  if (!token || token === '') {
    return headers;
  }
  headers.options.headers = {
    ...headers.options.headers,
    Authorization: `Bearer ${token}`,
  };
  return headers;
};

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: async (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        message.error(`Response status: ${error.response.status}`);
        const refresh = await inRefreshToken(error.response);
        return refresh;
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [authHeaderInterceptor],
};
