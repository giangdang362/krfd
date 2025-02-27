import { LocalStorageKey } from '@/constants/localstorage';
import { parseJson } from './json';

export const getToken = (): TOKEN.Auth | undefined => {
  const data = localStorage.getItem(LocalStorageKey.AUTH);
  const auth = parseJson<TOKEN.Auth>(data);
  return auth;
};

export const setToken = (t: TOKEN.Auth) => {
  localStorage.setItem(LocalStorageKey.AUTH, JSON.stringify(t));
};

export const removeToken = () => {
  localStorage.removeItem(LocalStorageKey.AUTH);
};

export const getStorageUser = (): API.UserStorage | undefined => {
  const data = localStorage.getItem(LocalStorageKey.USER);
  const user = parseJson<API.UserStorage>(data);
  return user;
};

export const setStorageUser = (t: API.UserStorage) => {
  localStorage.setItem(LocalStorageKey.USER, JSON.stringify(t));
};

export const removeStorageUser = () => {
  localStorage.removeItem(LocalStorageKey.USER);
};

export const getSessionStorageUser = (): API.UserStorage | undefined => {
  const data = sessionStorage.getItem(LocalStorageKey.USER);
  const user = parseJson<API.UserStorage>(data);
  return user;
};

export const setSessionStorageUser = (t: API.UserStorage) => {
  sessionStorage.setItem(LocalStorageKey.USER, JSON.stringify(t));
};

export const removeSessionStorageUser = () => {
  sessionStorage.removeItem(LocalStorageKey.USER);
};
