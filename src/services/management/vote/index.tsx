import { request } from '@umijs/max';

interface ParamsGetVote {
  voteType?: number | null;
  idolId?: number | undefined;
  keyWords?: string | null;
  PageNumber: number | null;
  PageSize: number | null;
}

interface ParamsGetVoteRequest {
  voteName?: string | null;
  communityId?: number | undefined;
  PageNumber: number | null;
  PageSize: number | null;
}

export async function getVote(params: ParamsGetVote): Promise<API.ResVote> {
  return request('/Votes/pagedVote', {
    method: 'GET',
    params: params,
  });
}

export async function getRequestOpenVote(params: ParamsGetVoteRequest): Promise<API.ResVote> {
  return request('/Votes/pagedRequestOpenVote', {
    method: 'GET',
    params: params,
  });
}

export async function deleteVote(id: number) {
  return request(`/Votes/${id}`, {
    method: 'DELETE',
  });
}

export async function postVote(payload: API.VotePayload) {
  return request('/Votes/CreateVoteAsync', {
    method: 'POST',
    data: payload,
  });
}

export async function putVote(payload: API.VotePayload, id: number) {
  return request(`/Votes/${id}`, {
    method: 'PUT',
    data: payload,
  });
}

export async function postApproveOpenVote(id: number) {
  return request(`Votes/approveOpenVote/${id}`, {
    method: 'POST',
  });
}

export async function postRejectOpenVote(id: number) {
  return request(`Votes/rejectOpenVote/${id}`, {
    method: 'POST',
  });
}

export async function getVoteById(id: number) {
  return request(`Votes/${id}`, {
    method: 'GET',
  });
}
