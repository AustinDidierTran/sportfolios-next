import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '../../../components/Custom/Avatar';
import styles from './GameCard.module.css';
import { formatDate, getInitialsFromName } from '../../../utils/stringFormats';
import moment from 'moment';
import { PHASE_STATUS_ENUM } from '../../../../common/enums';

export default function GameCard(props) {
  const { ranking1, ranking2, timeSlots, fields, x, y, phase } = props;

  const tooltip = useMemo(
    () =>
      `${ranking1.name} vs ${ranking2.name}, ${fields[x]?.field}, ${formatDate(
        moment.utc(timeSlots[y]?.date),
        'DD MMM HH:mm'
      )}`,
    [x, y]
  );

  return (
    <Card
      className={styles.gameCard}
      unselectable="on"
      // hack for firefox
      // Firefox requires some kind of initialization
      // which we can do by adding this attribute
      // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
      onDragStart={(e) => e.dataTransfer.setData('text/plain', '')}
    >
      <Tooltip title={tooltip} enterDelay={500}>
        <div className={styles.gameDiv}>
          <div className={styles.team1}>
            <Avatar
              initials={getInitialsFromName(ranking1.name, phase.status !== PHASE_STATUS_ENUM.NOT_STARTED)} // or team pic?
            ></Avatar>
          </div>
          <Typography className={styles.vs}>vs</Typography>
          <div className={styles.team2}>
            <Avatar
              initials={getInitialsFromName(ranking2.name, phase.status !== PHASE_STATUS_ENUM.NOT_STARTED)} // or team pic?
            ></Avatar>
          </div>
        </div>
      </Tooltip>
    </Card>
  );
}
