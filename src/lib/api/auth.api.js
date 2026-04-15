import { request } from './baseApi';

export const AuthApi = {
  login: ({ userName, password }) =>
    request('POST', '/Auth/login', { userName, password }),
};