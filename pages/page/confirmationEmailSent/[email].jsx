import React from 'react';
import { useRouter } from 'next/router';
import ConfirmationEmailSent from '../../../public/src/views/ConfirmationEmailSent';

const ConfirmationEmailSentRoute = () => {
  const router = useRouter();
  const { email } = router.query;

  return <ConfirmationEmailSent email={email} />;
};

export default ConfirmationEmailSentRoute;
