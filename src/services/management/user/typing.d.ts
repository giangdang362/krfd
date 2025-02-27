// @ts-ignore
/* eslint-disable */

declare namespace API {
  type User = {
    id?: number;
    isAdmin?: boolean;
    userName?: string;
    userEmail?: string;
    avatarFileName?: string;
    avatarUrl?: string;
    honeyPoint?: number;
    isActive?: boolean;
    startDate?: string;
    lastLoginDate?: string;
    idolFollows?: API.IdolItem[];
    jwtToken?: string;
    refreshToken?: string;
    password?: string;
  };

  type ResUser = {
    pageNumber?: number;
    pageSize?: number;
    data?: User[];
    totalRecords?: number;
    totalCount?: number;
  };

  type UserPayload = {
    userName?: string;
    password?: string;
    isActive?: boolean;
    idolIds?: number[];
  };
}
