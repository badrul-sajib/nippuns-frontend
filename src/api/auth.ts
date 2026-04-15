import api from './client';
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);
export const register = (data: { name: string; email: string; phone: string; password: string; password_confirmation: string }) =>
  api.post('/auth/register', data).then(r => r.data);
export const logout = () => api.post('/auth/logout').then(r => r.data);
export const getUser = () => api.get('/auth/user').then(r => r.data);
export const updateProfile = (data: any) => api.put('/auth/user', data).then(r => r.data);
export const changePassword = (data: { current_password: string; password: string; password_confirmation: string }) =>
  api.post('/auth/change-password', data).then(r => r.data);
