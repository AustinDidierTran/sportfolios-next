import { CartItemBuyer, CartItemSeller } from '../../../../../typescript/cart';
import api from '../../api';

const BASE_URL = '/api/cart';

interface GetCartItemsProps {
  buyers: CartItemBuyer[];
  total: {
    subTotal: number;
    taxes: [
      {
        id: string;
        percentage: string;
        amount: number;
      }
    ];
    itemCount: number;
  };
}

/** GET */
export const getCartItems = async (): Promise<GetCartItemsProps> => {
  const cart = await api(`${BASE_URL}/getCartItems`, { method: 'GET' }).then((res) => res.data);

  const count = cart.buyers.reduce(
    (prevBuyer: number, buyer: CartItemBuyer) =>
      buyer.sellers.reduce((prevSeller: number, seller: CartItemSeller) => seller.items.length + prevSeller, 0) +
      prevBuyer,
    0
  );

  return {
    buyers: cart.buyers,
    total: {
      subTotal: cart.total.subTotal,
      taxes: cart.total.taxes,
      itemCount: count,
    },
  };
};

export const updateCartItemSelected = async (selected: boolean, cartItemId: string): Promise<void> => {
  return api(`${BASE_URL}/cartItemSelected`, { method: 'PUT', body: JSON.stringify({ selected, cartItemId }) }).then(
    (res) => res.data
  );
};
