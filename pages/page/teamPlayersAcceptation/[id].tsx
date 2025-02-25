import React, { useState, useEffect, useContext } from 'react';

import { useRouter } from 'next/router';
import { CARD_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM, IMAGE_ENUM } from '../../../public/common/enums';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../../public/src/Store';
import dynamic from 'next/dynamic';
import { getEntity, getTeamPlayersPending } from '../../../public/src/actions/service/entity/get';
import { updateTeamPlayerAcceptation } from '../../../public/src/actions/service/entity/put';

const TeamPlayersAcceptation = dynamic(() => import('../../../public/src/views/TeamPlayersAcceptation'));

const TeamPlayersAcceptationRoute: React.FunctionComponent = () => {
  const router = useRouter();
  const { personId } = router.query;
  const [cards, setCards] = useState([]);
  const [name, setName] = useState<string>('');
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  const update = async (personId: string, status: string): Promise<void> => {
    if (status === STATUS_ENUM.UNCHANGED) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('player_skipped'),
        severity: SEVERITY_ENUM.INFO,
        vertical: 'top',
      });
    } else {
      await updateTeamPlayerAcceptation(teamId, personId, status);
      if (status === STATUS_ENUM.ACCEPTED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('player_accepted'),
          severity: SEVERITY_ENUM.SUCCESS,
          vertical: 'top',
        });
      } else if (status === STATUS_ENUM.REFUSED) {
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
    if (teamId) {
      const players = await getTeamPlayersPending(teamId);
      const team = await getEntity(teamId);

      setName(team.name);

      const playersMap = players.map((p: any) => {
        return { items: p, type: CARD_TYPE_ENUM.ACCEPT_TEAM_PLAYER };
      });

      if (personId) {
        playersMap?.sort((a: any, b: any) => {
          return a.items.id == personId ? -1 : b.items.id == personId ? 1 : 0;
        });
      }
      setCards(playersMap);
    }
  };

  useEffect(() => {
    if (teamId) {
      getCardsInfos();
    }
  }, [teamId]);

  return (
    <>
      <Head>
        <meta property="og:title" content={t('metadata.playersAcceptation.title')} />
        <meta property="og:description" content={t('metadata.playersAcceptation.description')} />
        <meta property="og:image" content={IMAGE_ENUM.SPORTFOLIOS_BANNER} />
      </Head>
      <TeamPlayersAcceptation cards={cards} update={update} getCards={getCardsInfos} name={name} />
    </>
  );
};

export default TeamPlayersAcceptationRoute;
