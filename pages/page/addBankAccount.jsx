import { AssignmentReturnOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { formatRoute } from '../../public/common/utils/stringFormat';
import api from '../../public/src/actions/api';
import { goTo } from '../../public/src/actions/goTo';
import AddBankAccount from '../../public/src/views/AddBankAccount';

const AddBankAccountRoute = () => {
  const router = useRouter();
  const { entityId, id } = router.query;

  React.useEffect(() => {
    hasStripeAccount();
  }, [entityId]);

  const hasStripeAccount = async () => {
    if (!entityId) {
      return;
    }
    const { data: hasStripeAccount } = await api(formatRoute('/api/stripe/hasStripeAccount', null, { entityId }));
    if (!hasStripeAccount) {
      goTo(`/${entityId}?tab=settings`);
    }
  };

  return <AddBankAccount entityId={entityId} id={id} />;
};
export default AddBankAccountRoute;
