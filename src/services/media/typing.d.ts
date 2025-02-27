// @ts-ignore
/* eslint-disable */

declare namespace API {
  type IdolItem = {
    id?: string;
    idolName?: string;
    anniversaryDay?: string;
    members?: IdolItem[];
    idolTypeId?: number;
    avatarUrl?: string;
    bannerUrl?: string;
    groupId?: number;
    percent?: number;
  };

  type IdolPayload = {
    idolTypeId?: number;
    avatarFileName?: string;
    bannerFileName?: string;
    idolName?: string;
    anniversaryDay?: string;
  };
}
