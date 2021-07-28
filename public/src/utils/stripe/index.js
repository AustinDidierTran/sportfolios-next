import api from '../../actions/api';

export const checkout = async (paymentMethodId) => {
  const res = await api('/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId }),
  });
  return res;
};

export const createRefund = async (params) => {
  const { data: receiptUrl } = await api('/api/stripe/createRefund', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return receiptUrl;
};

export const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems', { method: 'GET' });
  return cartItems;
};
