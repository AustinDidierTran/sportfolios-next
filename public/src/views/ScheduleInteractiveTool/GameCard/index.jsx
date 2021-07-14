import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './GameCard.module.css';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function GameCard(props) {
  const { ranking1, ranking2, timeSlots, fields, x, y, phase } = props;
  const { t } = useTranslation();

  const tooltip = useMemo(
    () =>
      `${ranking1.name} vs ${ranking2.name}, ${phase.name}, ${fields[x]?.field}, ${formatDate(
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
            <Typography>{ranking1.name}</Typography>
          </div>
          <Typography color="textSecondary" className={styles.vs}>
            {t('vs')}
          </Typography>
          <div className={styles.team2}>
            <Typography>{ranking2.name}</Typography>
          </div>
        </div>
      </Tooltip>
    </Card>
  );
}
