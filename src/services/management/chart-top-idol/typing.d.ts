// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ResChartTopIdol = {
    pageNumber?: number;
    pageSize?: number;
    data?: ChartIdol[];
    totalRecords?: number;
    totalCount?: number;
  };
  type ChartIdol = {
    idolId?: number;
    dailyVoteAmount?: number;
    monthlyVoteAmount?: number;
    idolName?: string;
    avatarFileName?: string;
    votingDate?: string;
    dailyPercent?: number;
    monthlyPercent?: number;
    isMyIdol?: boolean;
    isAbleToVote?: boolean;
  };
}
