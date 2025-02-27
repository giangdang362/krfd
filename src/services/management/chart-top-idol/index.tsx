import { request } from '@umijs/max';

interface ParamsChartIdol {
  IdolType: number | null;
  ChartType: number | null;
  IdolName: string | null;
  PageNumber: number | null;
  PageSize: number | null;
}

export async function getChartIdolDailyVote(params: ParamsChartIdol): Promise<API.ResChartTopIdol> {
  return request('/ChartIdolDailyVote/GetPagedIdolDailyVotesAsync', {
    method: 'GET',
    params: params,
  });
}
