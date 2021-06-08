import React from 'react';

import styles from './TwoTeamGame.module.css';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

export default function TwoTeamGame(props) {
  const { teams, field, start_time, phaseName, onClick, isPastGame } = props;
  const team1 = teams[0];
  const team2 = teams[1];
  let cardClass = styles.game;
  if (isPastGame) {
    cardClass = styles.pastGame;
  }
  return (
    <Card className={cardClass}>
      <div className={styles.main} onClick={onClick}>
        <Typography className={styles.phase} color="textSecondary">
          {phaseName? phaseName: ''}
        </Typography>
        <ListItemText
          className={styles.time}
          primary={formatDate(moment.utc(start_time), 'HH:mm')}
          secondary={formatDate(moment.utc(start_time), 'D MMM')}
        ></ListItemText>
        <Typography className={styles.field} color="textSecondary">
          {field}
        </Typography>
      </div>
      <div className={styles.teams}>
        <Typography className={styles.name1}>{team1.name}</Typography>
        <Typography className={styles.score1}>{team1.score}</Typography>
        <Typography className={styles.union}>-</Typography>
        <Typography className={styles.name2}>{team2.name}</Typography>
        <Typography className={styles.score2}>{team2.score}</Typography>
      </div>
    </Card>
  );
}
