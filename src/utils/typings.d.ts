declare namespace TOKEN {
  type Auth = {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    expiresAt?: number;
  };
  type UserIdentity = {
    exp: number;
    iat: number;
    id: number;
    lang?: string;
    org?: string;
    sub: string;
    type?: string;
  };
}
declare namespace TDateFerie {
  type FerieList = {
    name: string;
    date: Dayjs;
  };
}
