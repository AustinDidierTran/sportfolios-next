import React, { useMemo, useState, useContext } from 'react';
import CustomCard from '../Card';
import Typography from '@material-ui/core/Typography';
import styles from './MyEvents.module.css';

import { CARD_TYPE_ENUM, ROUTES_ENUM } from '../../../../common/enums';
import { goTo } from '../../../actions/goTo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import CustomButton from '../Button';
import CreatePractice from './CreatePractice';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../../actions/api';
import { Store } from '../../../../../public/src/Store';

export default function MyEventsTeam(props) {
  const { t } = useTranslation();
  const { gamesInfos, practiceInfos: practiceInfosProps, adminView } = props;
  const {
    state: { id },
  } = useContext(Store);
  const router = useRouter();

  const [practiceInfos, setPracticeInfos] = useState(practiceInfosProps);
  const [openPractice, setOpenPractice] = useState(false);

  const openGameDetailed = async (game) => {
    goTo(ROUTES_ENUM.entity, { id: game.event_id }, { tab: router.query.tab, gameId: game.id });
  };

  const createPractice = () => {
    setOpenPractice(true);
  };

  const closePractice = () => {
    setOpenPractice(false);
  };

  const refreshPractice = async () => {
    const { data } = await api(formatRoute('/api/entity', null, { id }));

    setPracticeInfos(data.eventInfos.practiceInfos);
    setOpenPractice(false);
  };

  const events = useMemo(() => {
    let game = gamesInfos?.map((game) => {
      const positions = [
        { name: game.team_names[0], score: game.team_scores[0] },
        { name: game.team_names[1], score: game.team_scores[1] },
      ];
      return { ...game, positions, type: CARD_TYPE_ENUM.MULTIPLE_TEAM_GAME, start_time: game.timeslot };
    });

    let practice = practiceInfos?.map((practice) => {
      return { ...practice, type: CARD_TYPE_ENUM.PRACTICE, start_time: practice.start_date };
    });

    return practice.concat(game).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }, [gamesInfos, practiceInfos]);

  return (
    <div>
      {adminView && (
        <div className={styles.buttons}>
          <CustomButton onClick={createPractice} endIcon="Add" color="primary" className={styles.button}>
            {t('create.create_practice')}
          </CustomButton>
        </div>
      )}
      {events?.length ? (
        events.map((event) => (
          <CustomCard
            key={event.id}
            items={{
              ...event,
              onClick: openGameDetailed,
            }}
            type={event.type}
          />
        ))
      ) : (
        <Typography variant="h6" color="textPrimary">
          {t('no.no_games')}
        </Typography>
      )}
      <CreatePractice isOpen={openPractice} onCreate={refreshPractice} onClose={closePractice} />
    </div>
  );
}
