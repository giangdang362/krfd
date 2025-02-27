import { request } from '@umijs/max';

export async function getPointSetting(): Promise<API.PointSetting> {
  return request('/PointSetting', {
    method: 'GET',
  });
}

export async function putPointSetting(payload: API.PointSetting) {
  return request('/PointSetting', {
    method: 'PUT',
    data: payload,
  });
}

export async function getAllNotification(): Promise<API.NotificationItem[]> {
  return request('/Notification/GetAllNotificationAsync', {
    method: 'GET',
  });
}

export async function getNotification(notificationId: number): Promise<API.NotificationItem> {
  return request('/Notification/GetNotificationAsync', {
    method: 'GET',
    params: { notificationId },
  });
}

export async function createNotification(payload: API.NotificationReq): Promise<boolean> {
  return request('/Notification', {
    method: 'POST',
    data: payload,
  });
}

export async function updateNotification(
  payload: API.NotificationReq,
  id?: number,
): Promise<boolean> {
  return request('/Notification/' + id, {
    method: 'PUT',
    data: payload,
  });
}

export async function deleteNotification(id?: number): Promise<boolean> {
  return request('/Notification/' + id, {
    method: 'DELETE',
  });
}
