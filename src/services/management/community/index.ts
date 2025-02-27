import { request } from '@umijs/max';

interface ParamsCommunity {
  voteType?: number;
  communityId?: number;
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

interface ParamsCommunityDetail {
  idolCommunityId?: number;
}

interface ParamsCommunityAll {
  communityName?: string | null;
  PageNumber: number | null;
  PageSize: number | null;
}

export async function getAllIdolCommunity(params?: ParamsCommunityAll): Promise<API.ResCommunity> {
  return request('/IdolCommunity/GetPagedIdolCommunityAsync', {
    method: 'GET',
    params: params,
  });
}

export async function getIdolCommunityDetail(
  params: ParamsCommunityDetail,
): Promise<API.CommunityItem> {
  return request('/IdolCommunity/GetIdolCommunityAsync', {
    method: 'GET',
    params: params,
  });
}

export async function getFundingCommunity(params: ParamsCommunity): Promise<API.ResVote> {
  return request(`/Votes`, {
    method: 'GET',
    params: params,
  });
}

export async function getRequestVoteCommunity(params: ParamsGetVoteRequest): Promise<API.ResVote> {
  return request(`/Votes/pagedRequestOpenVote`, {
    method: 'GET',
    params: params,
  });
}
