import { request } from '@umijs/max';

interface ParamsGetUser {
  userName?: string | null;
  isGetAllData?: boolean;
  PageNumber: number | null;
  PageSize: number | null;
}

export async function getUsers(params: ParamsGetUser): Promise<API.ResUser> {
  return request('/Users/pagedUser', {
    method: 'GET',
    params: params,
  });
}

export async function putUser(id: number, payload: API.UserPayload) {
  return request(`/Users/${id}`, {
    method: 'PUT',
    data: payload,
  });
}
