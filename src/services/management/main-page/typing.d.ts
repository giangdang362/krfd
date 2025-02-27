// @ts-ignore
/* eslint-disable */

declare namespace API {
  type BannerItem = {
    id?: number;
    bannerUrl?: string;
    fileBanner?: string;
  };

  type FormTypeBanner = {
    bannerUrl1?: string;
    bannerUrl2?: string;
    bannerUrl3?: string;
  };

  type FormTypePopupApp = {
    popup1?: string;
    popup2?: string;
  };

  type BannerPayload = {
    bannerMainPages?: API.BannerItem[];
  };

  type TopicFundingVote = {
    voteId?: number;
    voteName?: string;
  };

  type FandomServiceItem = {
    id?: number;
    fandomServiceBannerUrl?: string;
    fandomServiceFileBanner?: string;
  };

  type TopicFundingVotePayload = {
    voteType?: number;
    voteIds?: (number | string | undefined)[];
  };
}
