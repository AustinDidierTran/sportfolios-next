import React, { useState, useEffect, useContext } from 'react';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../public/src/utils/stringFormats';
import { CARD_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM, IMAGE_ENUM } from '../../../public/common/enums';
import api from '../../../public/src/actions/api';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../public/src/Store';
import dynamic from 'next/dynamic';

const PlayersAcceptation = dynamic(() => import('../../../public/src/views/PlayersAcceptation'));

type IPerson = {
  items: { id: string };
  type: string;
};

const PlayersAcceptationRoute: React.FunctionComponent = () => {
  const router = useRouter();
  const { personId } = router.query;
  const [cards, setCards] = useState([]);
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const update = async (personId: string, registrationStatus: string) => {
    if (registrationStatus === STATUS_ENUM.UNCHANGED) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('player_skipped'),
        severity: SEVERITY_ENUM.INFO,
        vertical: 'top',
      });
    } else {
      await api('/api/entity/playerAcceptation', {
        method: 'PUT',
        body: JSON.stringify({ eventId, personId, registrationStatus }),
      });
      if (registrationStatus === STATUS_ENUM.ACCEPTED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('player_accepted'),
          severity: SEVERITY_ENUM.SUCCESS,
          vertical: 'top',
        });
      } else if (registrationStatus === STATUS_ENUM.REFUSED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('player_refused'),
          severity: SEVERITY_ENUM.ERROR,
          vertical: 'top',
        });
      }
    }
  };

  const getCardsInfos = async (): Promise<void> => {
    if (eventId) {
      const { data } = await api(formatRoute('/api/entity/playersPendingAndRefused', null, { eventId }), {
        method: 'GET',
      });

      const pending = data.pending?.map((p: IPerson) => {
        return { items: p, type: CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS };
      });
      const refused = data.refused?.map((t: IPerson) => {
        return { items: t, type: CARD_TYPE_ENUM.ACCEPT_PLAYER_INFOS };
      });
      const players = pending.concat(refused);

      if (personId) {
        players?.sort((a: IPerson, b: IPerson) => {
          return a.items.id == personId ? -1 : b.items.id == personId ? 1 : 0;
        });
      }
      setCards(players);
    }
  };

  useEffect(() => {
    if (eventId) {
      getCardsInfos();
    }
  }, [eventId]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.playersAcceptation.title')} />
        <meta property="og:description" content={t('metadata.playersAcceptation.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <PlayersAcceptation cards={cards} update={update} getCards={getCardsInfos} />
    </>
  );
};

export default PlayersAcceptationRoute;
