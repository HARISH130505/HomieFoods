export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const endpoints = {
  restaurants: `${API_BASE_URL}/restaurants`,
  restaurantById: (id: string | number) => `${API_BASE_URL}/restaurants/${id}`,
  dishes: `${API_BASE_URL}/dishes`,
  chef: `${API_BASE_URL}/chef`,
  orders: `${API_BASE_URL}/orders`,
  orderStatus: (id: string | number) => `${API_BASE_URL}/orders/${id}/status`,
};
