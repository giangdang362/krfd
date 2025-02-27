// @ts-ignore
/* eslint-disable */

declare namespace API {
  type NotificationItem = {
    id?: number;
    updatedDate?: string;
    title?: string;
    description?: string;
  };

  type PointSetting = {
    refererPoint?: number;
    receivedEventPoint?: number;
    giveFriendPoint?: number;
    attendancePoint?: number;
  };

  type NotificationReq = {
    title?: string;
    description?: string;
    updatedDate?: string;
  };
}
