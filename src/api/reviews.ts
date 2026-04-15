import api from './client';
export const submitReview = (data: { product_id: string; rating: number; title?: string; body: string }) =>
  api.post('/reviews', data).then(r => r.data);
