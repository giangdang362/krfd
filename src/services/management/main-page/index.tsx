import { request } from '@umijs/max';

interface ParamsGetTopicFundingVote {
  voteType: number | null;
}

interface ParamsGetBanner {
  bannerType: number | null;
}

export async function getListBannerMainPage(params: ParamsGetBanner): Promise<API.BannerItem[]> {
  return request(`/MainPage/GetListBannerMainPageAsync?bannerType=${params.bannerType}`, {
    method: 'GET',
  });
}

export async function putBannerMainPage(payload: API.BannerPayload) {
  return request('/MainPage/EditBannerMainPage', {
    method: 'PUT',
    data: payload,
  });
}

export async function getTopicFundingVoteMainPage(
  params: ParamsGetTopicFundingVote,
): Promise<API.TopicFundingVote[]> {
  return request('/MainPage/GetListTopicFundingVoteMainPageDetailAsync', {
    method: 'GET',
    params: params,
  });
}

export async function getFandomServiceMainPage(): Promise<API.FandomServiceItem> {
  return request('/MainPage/GetFandomServiceMainPageAsync', {
    method: 'GET',
  });
}

export async function putFandomServiceMainPage(payload: API.FandomServiceItem) {
  return request('/MainPage/EditFandomServiceMainPage', {
    method: 'PUT',
    data: payload,
  });
}

export async function putTopicFundingVoteMainPage(payload: API.TopicFundingVotePayload) {
  return request('/MainPage/EditTopicFundingVoteMainPage', {
    method: 'PUT',
    data: payload,
  });
}
