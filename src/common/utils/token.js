import { getCookie } from './cookie';

export const getAccessToken = () => {
  return getCookie('access-token');
};
