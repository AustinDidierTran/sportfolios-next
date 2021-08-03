import React from 'react';

import styles from './TwoTeamGameEditable.module.css';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

import CustomIconButton from '../../IconButton';
import { useTranslation } from 'react-i18next';

export default function TwoTeamGameEditable(props) {
  const { t } = useTranslation();
  const { positions, field, startTime, phaseName, onClick, onEdit, onDelete } = props;

  const position1 = positions[0];
  const position2 = positions[1];

  return (
    <Card className={styles.gameEdit}>
      <div onClick={onClick}>
        <div className={styles.main}>
          <Typography className={styles.phase} color="textSecondary">
            {phaseName}
          </Typography>
          {startTime ? (
            <ListItemText
              className={styles.time}
              primary={formatDate(moment.utc(startTime), 'HH:mm')}
              secondary={formatDate(moment.utc(startTime), 'D MMM')}
            />
          ) : (
            <ListItemText className={styles.time} primary={t('no.no_time_yet')} secondary={t('no.no_date_yet')} />
          )}
          <Typography className={styles.field} color="textSecondary">
            {field ? field : t('no.no_field_yet')}
          </Typography>
        </div>
        <div className={styles.teams}>
          <Typography className={styles.name1}>{position1.name}</Typography>
          <Typography className={styles.score1}>{position1.score}</Typography>
          <Typography className={styles.union}>-</Typography>
          <Typography className={styles.name2}>{position2.name}</Typography>
          <Typography className={styles.score2}>{position2.score}</Typography>
        </div>
      </div>
      {onEdit ? (
        <div className={styles.buttonsContainer}>
          <CustomIconButton
            className={styles.icon}
            onClick={onEdit}
            tooltip={t('edit.edit_game')}
            icon="Edit"
            style={{ color: 'primary' }}
          />
          <CustomIconButton
            className={styles.icon}
            onClick={onDelete}
            tooltip={t('delete.delete')}
            icon="Delete"
            style={{ color: 'primary' }}
          />
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <CustomIconButton
            className={styles.icon}
            onClick={onDelete}
            tooltip={t('delete.delete')}
            icon="Delete"
            style={{ color: 'primary' }}
          />
        </div>
      )}
    </Card>
  );
}
