import { formatRoute } from '../../utils/stringFormats';
import api from '../api';
const BASE_URL = '/api/stripe';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function editShopItem(itemParams: any): Promise<number> {
  return api(`${BASE_URL}/editItem`, { method: 'PUT', body: JSON.stringify({ itemParams }) }).then((res) => res.data);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createShopItem(itemParams: any): Promise<number> {
  return api(`${BASE_URL}/createItem`, { method: 'POST', body: JSON.stringify({ itemParams }) }).then(
    (res) => res.data
  );
}

export async function hasStripeBankAccount(entityId: string): Promise<boolean> {
  return api(
    formatRoute(`${BASE_URL}/hasStripeBankAccount`, null, {
      entityId,
    })
  ).then((res) => res.data);
}

export async function deleteShopItem(stripeProductId: string, stripePriceId: string): Promise<boolean> {
  return api(
    formatRoute(`${BASE_URL}/deleteItem`, null, {
      stripeProductId,
      stripePriceId,
    }),
    {
      method: 'DELETE',
    }
  ).then((res) => res.data);
}
