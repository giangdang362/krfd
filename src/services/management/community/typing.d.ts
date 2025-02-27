// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CommunityItem = {
    id?: number;
    idolId?: number;
    requestOpenVoteAmount?: number;
    dailyVoteAmount?: number;
    pDs?: number;
    totalPost?: number;
    communityName?: string;
    bannerFileName?: string;
    avatarFileName?: string;
    idolCommunityPosts?: number | null;
  };
  type ResCommunity = {
    pageNumber?: number;
    pageSize?: number;
    data?: CommunityItem[];
    totalRecords?: number;
    totalCount?: number;
  };
}
