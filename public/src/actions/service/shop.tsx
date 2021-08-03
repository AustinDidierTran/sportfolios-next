import api from '../api';
import { Cart, ShopCartItems, ShopItems } from '../../../../typescript/types';
import { formatRoute } from '../../utils/stringFormats';

const BASE_URL = '/api/shop';

export async function getCartItems(): Promise<Cart> {
  return api(`${BASE_URL}/getCartItems`, { method: 'GET' }).then((res) => res.data);
}

export async function getShopItems(id: string): Promise<ShopItems[]> {
  return api(formatRoute(`${BASE_URL}/getItems`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export async function getSoldItems(id: string): Promise<ShopCartItems[]> {
  return api(formatRoute(`${BASE_URL}/sales`, null, { id }), { method: 'GET' }).then((res) => res.data);
}
