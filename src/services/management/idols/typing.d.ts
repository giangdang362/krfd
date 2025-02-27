// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ResIdols = {
    pageNumber?: number;
    pageSize?: number;
    data?: IdolItem[];
    totalRecords?: number;
    totalCount?: number;
  };
  type IdolItem = {
    id?: number;
    idolName?: string;
    anniversaryDay?: string;
    members?: IdolItem[];
    idolTypeId?: number;
    avatarFileName?: string;
    bannerFileName?: string;
    groupId?: number;
    voteCount?: number;
    percent?: number;
    voteNumber?: number;
  };

  type PayloadIdol = {
    id?: number;
    idolTypeId?: number;
    avatarFileName?: string;
    bannerFileName?: string;
    idolName?: string;
    anniversaryDay?: string;
    memberIds?: number[] | undefined;
  };
}
