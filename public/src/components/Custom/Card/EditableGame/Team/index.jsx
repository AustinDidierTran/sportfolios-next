import React from 'react';

import styles from './Team.module.css';

import CustomTextField from '../../../TextField';
import Typography from '@material-ui/core/Typography';

export default function Team(props) {
  const { team, getRank } = props;

  return (
    <div className={styles.team}>
      <Typography className={styles.position} color="textSecondary" variant="body1">
        {getRank(team.id)}
      </Typography>
      <Typography className={styles.name} variant="h6">
        {team.name}
      </Typography>
      <CustomTextField className={styles.score} type="number" {...team.input.inputProps} />
    </div>
  );
}
