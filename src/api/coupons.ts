import api from './client';
export const validateCoupon = (code: string) =>
  api.get(`/coupons/${code}/validate`).then(r => r.data);
