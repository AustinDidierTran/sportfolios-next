import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../public/common/utils/stringFormat';
import { CARD_TYPE_ENUM } from '../../../public/common/enums';
import api from '../../../public/src/actions/api';
import TeamsAcceptation from '../../../public/src/views/TeamsAcceptation';

const TeamsAcceptationRoute = () => {
  const router = useRouter();
  const { id: eventId, rosterId } = router.query;
  const [cards, setCards] = useState([]);

  const update = async (rosterId, registrationStatus) => {
    await api('/api/entity/teamAcceptation', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        rosterId,
        registrationStatus,
      }),
    });
  };

  const getCardsInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/teamsPending', null, {
        eventId,
      })
    );

    const teams = data?.map((t) => {
      return { items: t, type: CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS };
    });
    if (rosterId) {
      teams?.sort((a, b) => {
        return a.items.id == rosterId ? -1 : b.items.id == rosterId ? 1 : 0;
      });
    }
    setCards(teams);
  };

  useEffect(() => {
    if (eventId) {
      getCardsInfos();
    }
  }, [eventId]);

  return <TeamsAcceptation cards={cards} update={update} />;
};

export default TeamsAcceptationRoute;
