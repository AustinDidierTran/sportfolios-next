import React from 'react';
import RosterInvite from '../../../public/src/views/RosterInvite';
import { useRouter } from 'next/router';

const RosterInviteRoute = () => {
  const router = useRouter();
  const { token } = router.query;

  return <RosterInvite token={token} />;
};

export default RosterInviteRoute;
