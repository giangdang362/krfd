// @ts-ignore
/* eslint-disable */

declare namespace API {
  type VoteItem = {
    voteId?: number;
    voteName?: string;
    dateRange?: Array;
    startDate?: string;
    endDate?: string;
    requestDate?: string;
    rewardDetail?: string;
    goalPoint?: number;
    isUnlimited?: boolean;
    vote?: number;
    status?: string;
    voteContent?: string;
    voteTypeId?: number;
    bannerUrl?: string;
    bannerFileName?: string;
    idolsName?: string[];
    idols?: API.IdolItem[];
    community?: string;
    reward?: string;
    rewardUrl?: string;
    idolsToVote?: API.IdolItem[];
  };

  type ResVote = {
    pageNumber?: number;
    pageSize?: number;
    data?: VoteItem[];
    totalRecords?: number;
    totalCount?: number;
  };

  type VotePayload = {
    communityId?: number;
    voteName?: string;
    voteTypeId?: number;
    startDate?: string;
    endDate?: string;
    requestDate?: string;
    reward?: string;
    bannerFileName?: string;
    voteContent?: string;
    goalPoint?: number;
    isUnlimited?: boolean;
    reward?: string;
    idolIds?: number[];
    rewardUrl?: string;
  };
}
