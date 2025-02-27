import { request } from '@umijs/max';

export async function login(params: API.Login): Promise<API.User> {
  return request('/Users/login', {
    method: 'POST',
    data: params,
  });
}
