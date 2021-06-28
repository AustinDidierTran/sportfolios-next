import api from '../api';
import { Cart } from '../../../../typescript/types';

const BASE_URL = '/api/shop';

export async function getCartItems(): Promise<Cart> {
  const { data } = await api(`${BASE_URL}/getCartItems`);
  return data;
}
