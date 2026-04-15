import api from './client';
export const placeOrder = (data: any) => api.post('/orders', data).then(r => r.data);
export const fetchOrders = () => api.get('/orders').then(r => r.data);
export const fetchOrder = (orderNumber: string) =>
  api.get(`/orders/${orderNumber}`).then(r => r.data);
export const cancelOrder = (orderNumber: string) =>
  api.post(`/orders/${orderNumber}/cancel`).then(r => r.data);
