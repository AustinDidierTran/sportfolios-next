import React from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '../../../../components/Custom/Avatar';
import styles from './SuggestedGameCard.module.css';
import { getInitialsFromName } from '../../../../utils/stringFormats';
import { PHASE_STATUS_ENUM } from '../../../../../common/enums';

export default function SuggestedGameCard(props) {
  const { ranking1, ranking2, phaseStatus, phaseName, phaseOrder } = props;

  if (phaseStatus !== PHASE_STATUS_ENUM.NOT_STARTED) {
    ranking1.name = ranking1.teamName;
    ranking2.name = ranking2.teamName;
  }

  const alphabet = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let letter;
  letter = alphabet[phaseOrder];

  const tooltip = `${ranking1.name} vs ${ranking2.name}, ${phaseName}`;

  return (
    <Card className={styles.gameCard}>
      <Tooltip title={tooltip} enterDelay={500}>
        <div>
          <div className={styles.pool}>
            <Typography color="textSecondary">{phaseName}</Typography>
          </div>
          <div className={styles.gameDiv}>
            <div className={styles.team1}>
              <Avatar
                initials={
                  phaseStatus !== PHASE_STATUS_ENUM.NOT_STARTED
                    ? getInitialsFromName(ranking1.name, true)
                    : `${ranking1.initial_position}.${letter}`
                } // or team pic?
              ></Avatar>
            </div>
            <Typography className={styles.vs}>vs</Typography>
            <div className={styles.team2}>
              <Avatar
                initials={
                  phaseStatus !== PHASE_STATUS_ENUM.NOT_STARTED
                    ? getInitialsFromName(ranking2.name, true)
                    : `${ranking2.initial_position}.${letter}`
                } // or team pic?
              ></Avatar>
            </div>
          </div>
        </div>
      </Tooltip>
    </Card>
  );
}
