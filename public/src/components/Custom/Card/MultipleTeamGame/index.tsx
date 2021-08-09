import React, { useMemo } from 'react';

import styles from './MultipleTeamGame.module.css';

import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import Avatar from '../../Avatar';
import { useTranslation } from 'react-i18next';
import { Positions } from '../../../../../../typescript/types';
import Card from '@material-ui/core/Card';
import { goTo } from '../../../../actions/goTo';
import { ROUTES_ENUM } from '../../../../../common/enums';
import router from 'next/router';

interface IProps {
  game: IGame;
  onClick: (id: string, eventId?: string) => void;
  withoutCard?: boolean;
  teamsAreClickable?: boolean;
}

interface IGame {
  field: string;
  phaseName: string;
  startTime: string;
  positions: Positions[];
  id?: string;
  eventId?: string;
}

const MultipleTeamGame: React.FunctionComponent<IProps> = (props) => {
  const {
    game: { field, startTime, phaseName, positions, eventId, id },
    onClick,
    withoutCard,
    teamsAreClickable = true,
  } = props;
  const { t } = useTranslation();

  const isSpecific = useMemo<boolean>(() => {
    return !!router.query.gameId;
  }, [router.query.gameId]);

  const getContent = () => {
    return (
      <>
        <div className={styles.teams}>
          {positions?.map((position, i) => (
            <div className={styles.teamContent} key={i}>
              <div
                className={teamsAreClickable ? styles.teamInfos : styles.generalGameTeam}
                onClick={() => (isSpecific ? goTo(ROUTES_ENUM.entity, { id: position.id }) : null)}
              >
                <Avatar photoUrl={position.photoUrl} className={styles.avatar}></Avatar>
                <Typography className={styles.name}>{position.name}</Typography>
              </div>
              <Typography className={styles.score}>{position.score}</Typography>
            </div>
          ))}
        </div>

        <div className={styles.time}>
          <List>
            <ListItemText primary={phaseName} secondary={field ? field : t('no.no_field_yet')} />
            {startTime ? (
              <ListItemText
                primary={formatDate(moment.utc(startTime), 'ddd D MMM')}
                secondary={formatDate(moment.utc(startTime), 'HH:mm')}
              />
            ) : (
              <ListItemText
                className={styles.time}
                primary={t('no.no_time_yet')}
                secondary={t('no.no_date_yet')}
              ></ListItemText>
            )}
          </List>
        </div>
      </>
    );
  };

  if (withoutCard) {
    return <div className={teamsAreClickable ? styles.game : styles.nonClickableGame}>{getContent()}</div>;
  }

  return (
    <Card className={teamsAreClickable ? styles.game : styles.nonClickableGame} onClick={() => onClick(eventId, id)}>
      {getContent()}
    </Card>
  );
};
export default MultipleTeamGame;
