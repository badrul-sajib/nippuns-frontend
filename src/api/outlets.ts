import api from './client';
export const fetchOutlets = () => api.get('/outlets').then(r => r.data);
export const fetchDeliveryZones = () => api.get('/delivery-zones').then(r => r.data);
