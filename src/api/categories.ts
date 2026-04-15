import api from './client';
export const fetchCategories = () => api.get('/categories').then(r => r.data);
export const fetchCategoryProducts = (slug: string, params?: { sort?: string; page?: number }) =>
  api.get(`/categories/${slug}/products`, { params }).then(r => r.data);
