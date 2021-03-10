import React from 'react';

import styles from './MultipleTeamGame.module.css';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

export default function MultipleTeamGame(props) {
  const { teams, field, start_time, phaseName, onClick, isPastGame } = props;

  return (
    <Card className={styles.game} onClick={onClick}>
      <div className={styles.teams}>
        {teams.map((team, i) => (
          <div className={styles.teamContent} key={i}>
            <img className={styles.logo} src={team.photo_url} />
            <Typography className={styles.name}>{team.name}</Typography>
            <Typography className={styles.score}>{team.score}</Typography>
          </div>
        ))}
      </div>

      <div className={styles.time}>
        <List>
          <ListItemText primary={phaseName} secondary={field} />
          <ListItemText
            primary={formatDate(moment(start_time), 'ddd D MMM')}
            secondary={formatDate(moment(start_time), 'HH:mm')}
          />
        </List>
      </div>
    </Card>
  );
}
