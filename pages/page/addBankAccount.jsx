import { useRouter } from 'next/router';
import React from 'react';
import api from '../../public/src/actions/api';
import { formatRoute, goTo } from '../../public/src/actions/goTo';
import AddBankAccount from '../../public/src/views/AddBankAccount';

const AddBankAccountRoute = (props) => {
  const router = useRouter();
  const { entityId, id } = router.query;

  React.useEffect(() => {
    hasStripeAccount();
  }, []);

  const hasStripeAccount = async () => {
    const { data: hasStripeAccount } = await api(formatRoute('/api/stripe/hasStripeAccount', null, { entityId }));
    if (!hasStripeAccount) {
      goTo(`/${entityId}?tab=settings`);
    }
  };

  return <AddBankAccount entityId={entityId} id={id} />;
};

export default AddBankAccountRoute;
