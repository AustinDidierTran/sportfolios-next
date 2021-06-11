import React from 'react';

import styles from './Practice.module.css';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

interface IProps {
  location: string;
  name: string;
  startTime: string;
  endTime: string;
  onClick: (props: IProps) => void;
}

const Practice: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { location, name, startTime, endTime, onClick } = props;

  return (
    <Card className={styles.game} onClick={() => onClick(props)}>
      <Typography className={styles.phase} color="textPrimary">
        {t('practice')}
      </Typography>
      <Typography className={styles.main} color="textPrimary">
        {name}
        <ListItemText
          className={styles.time}
          primary={`${formatDate(moment.utc(startTime), 'HH:mm')} - ${formatDate(moment.utc(endTime), 'HH:mm')}`}
          secondary={formatDate(moment.utc(startTime), 'ddd D MMM')}
        ></ListItemText>
        <Typography color="textSecondary">{location}</Typography>
      </Typography>
    </Card>
  );
};

export default Practice;
