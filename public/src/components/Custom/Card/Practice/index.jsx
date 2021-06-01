import React from 'react';

import styles from './GameItem.module.css';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

export default function GameItem(props) {
  const { t } = useTranslation();
  const { location, name, start_time: startTime } = props;

  return (
    <Card className={styles.game}>
      <Typography className={styles.phase} color="textPrimary">
        {t('practice')}
      </Typography>
      <div className={styles.main}>
        <Typography className={styles.phase} color="textSecondary">
          {name}
        </Typography>
        <ListItemText
          className={styles.time}
          primary={formatDate(moment(startTime), 'HH:mm')}
          secondary={formatDate(moment(startTime), 'D MMM')}
        ></ListItemText>
        <Typography className={styles.field} color="textSecondary">
          {location}
        </Typography>
      </div>
    </Card>
  );
}
