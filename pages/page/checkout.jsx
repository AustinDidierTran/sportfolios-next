import React from 'react';
import { LoadingSpinner } from '../../public/src/components/Custom';
import { useApiRoute } from '../../public/src/hooks/queries';
import Checkout from '../../public/src/views/Checkout';

const CheckoutRoute = (props) => {
  const { isLoading, response } = useApiRoute('/api/shop/cartTotal');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <Checkout total={response.total} />;
};

export default CheckoutRoute;
