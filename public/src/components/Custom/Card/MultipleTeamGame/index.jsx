import React from 'react';

import styles from './MultipleTeamGame.module.css';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

export default function MultipleTeamGame(props) {
  const { positions, field, start_time, phaseName, onClick, isPastGame } = props;

  return (
    <Card className={styles.game} onClick={onClick}>
      <div className={styles.teams}>
        {positions.map((position, i) => (
          <div className={styles.teamContent} key={i}>
            {
              //TODO: if roster_id, put a the team picture
            }
            <img className={styles.logo} />
            <Typography className={styles.name}>{position.name}</Typography>
            <Typography className={styles.score}>{position.score}</Typography>
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
