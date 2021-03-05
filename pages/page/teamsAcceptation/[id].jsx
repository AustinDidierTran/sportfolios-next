import React, { useEffect, useState, useContext } from 'react';

import { useRouter } from 'next/router';
import { formatRoute } from '../../../public/common/utils/stringFormat';
import { CARD_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../public/common/enums';
import api from '../../../public/src/actions/api';
import TeamsAcceptation from '../../../public/src/views/TeamsAcceptation';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../public/src/Store';

const TeamsAcceptationRoute = () => {
  const router = useRouter();
  const { id: eventId, rosterId } = router.query;
  const [cards, setCards] = useState([]);
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const update = async (rosterId, registrationStatus) => {
    if (registrationStatus === STATUS_ENUM.UNCHANGED) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team.team_skipped'),
        severity: SEVERITY_ENUM.INFO,
        vertical: 'top',
      });
    } else {
      await api('/api/entity/teamAcceptation', {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          rosterId,
          registrationStatus,
        }),
      });
      if (registrationStatus === STATUS_ENUM.ACCEPTED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('team.team_accepted'),
          severity: SEVERITY_ENUM.SUCCESS,
          vertical: 'top',
        });
      } else if (registrationStatus === STATUS_ENUM.REFUSED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('team.team_refused'),
          severity: SEVERITY_ENUM.ERROR,
          vertical: 'top',
        });
      }
    }
  };

  const getCardsInfos = async () => {
    if (eventId) {
      const { data } = await api(
        formatRoute('/api/entity/teamsPendingAndRefused', null, {
          eventId,
        })
      );

      const pending = data.pending?.map((t) => {
        return { items: t, type: CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS };
      });
      const refused = data.refused?.map((t) => {
        return { items: t, type: CARD_TYPE_ENUM.ACCEPT_TEAM_INFOS };
      });
      const teams = pending.concat(refused);

      if (rosterId) {
        teams?.sort((a, b) => {
          return a.items.id == rosterId ? -1 : b.items.id == rosterId ? 1 : 0;
        });
      }
      setCards(teams);
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
        <meta property="og:title" content={t('metadata.teamsAcceptation.title')} />
        <meta property="og:description" content={t('metadata.teamsAcceptation.description')} />
        <meta
          property="og:image"
          content="https://sportfolios-images.s3.amazonaws.com/development/images/entity/20210225-h08xs-8317ff33-3b04-49a1-afd3-420202cddf73"
        />
      </Head>
      <TeamsAcceptation cards={cards} update={update} getCards={getCardsInfos} />
    </>
  );
};

export default TeamsAcceptationRoute;
