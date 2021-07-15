import React from 'react';

import styles from './MultipleTeamGame.module.css';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import Avatar from '../../Avatar';
import { useTranslation } from 'react-i18next';

export default function MultipleTeamGame(props) {
  const { positions, field, startTime, phaseName, onClick } = props;
  const { t } = useTranslation();

  return (
    <Card className={styles.game} onClick={() => onClick(props)}>
      <div className={styles.teams}>
        {positions.map((position, i) => (
          <div className={styles.teamContent} key={i}>
            <Avatar photoUrl={position.photoUrl} className={styles.avatar}></Avatar>
            <Typography className={styles.name}>{position.name}</Typography>
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
    </Card>
  );
}
