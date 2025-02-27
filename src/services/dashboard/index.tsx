import { request } from '@umijs/max';

interface ParamsGetChartTotalVisit {
  queryDate?: string | null;
}

export async function getChartVote(): Promise<API.ResChartVote> {
  return request('/Dashboard/chartVote', {
    method: 'GET',
  });
}

export async function getChartPoint(): Promise<API.ResChartPoint> {
  return request('/Dashboard/chartPoint', {
    method: 'GET',
  });
}

export async function getChartTotalVisit(
  params: ParamsGetChartTotalVisit,
): Promise<API.VisitItem[]> {
  return request('/Dashboard/chartTotalVisit', {
    method: 'GET',
    params: params,
  });
}
