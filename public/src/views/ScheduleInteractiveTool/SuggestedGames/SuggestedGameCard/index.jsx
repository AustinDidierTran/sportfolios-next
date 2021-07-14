import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './SuggestedGameCard.module.css';

export default function SuggestedGameCard(props) {
  const { ranking1, ranking2, phaseName } = props;

  const tooltip = `${ranking1.name} vs ${ranking2.name}, ${phaseName}`;

  return (
    <Card className={styles.gameCard}>
      <Tooltip title={tooltip} enterDelay={500}>
        <div className={styles.gameDiv}>
          <div className={styles.team1}>
            <Typography> {ranking1.name} </Typography>
          </div>
          <Typography color="textSecondary" className={styles.vs}>
            vs
          </Typography>
          <div className={styles.team2}>
            <Typography> {ranking2.name} </Typography>
          </div>
        </div>
      </Tooltip>
    </Card>
  );
}
