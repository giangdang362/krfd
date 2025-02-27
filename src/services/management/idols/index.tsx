import { request } from '@umijs/max';

interface ParamsGetIdol {
  idolType?: number | null;
  estalisday?: string | null;
  idolName?: string | null;
  PageNumber: number | null;
  PageSize: number | null;
}

export async function getIdols(params: ParamsGetIdol): Promise<API.ResIdols> {
  return request('/Idols/pagedIdol', {
    method: 'GET',
    params: params,
  });
}

export async function deleteIdol(id: number) {
  return request(`/Idols/${id}`, {
    method: 'DELETE',
  });
}

export async function postIdol(payload: API.PayloadIdol) {
  return request('/Idols', {
    method: 'POST',
    data: payload,
  });
}

export async function putIdol(payload: API.PayloadIdol) {
  return request(`/Idols/${payload.id}`, {
    method: 'PUT',
    data: payload,
  });
}
