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
  const { teams, field, start_time, phaseName, onClick, onEdit, onDelete } = props;

  const team1 = teams[0];
  const team2 = teams[1];

  return (
    <Card className={styles.gameEdit}>
      <div onClick={onClick}>
        <div className={styles.main}>
          <Typography className={styles.phase} color="textSecondary">
            {phaseName}
          </Typography>
          <ListItemText
            className={styles.time}
            primary={formatDate(moment(start_time), 'HH:mm')}
            secondary={formatDate(moment(start_time), 'D MMM')}
          ></ListItemText>
          <Typography className={styles.field} color="textSecondary">
            {field}
          </Typography>
        </div>
        <div className={styles.teams}>
          <Typography className={styles.name1}>{team1.name}</Typography>
          <Typography className={styles.score1}>{team1.score}</Typography>
          <Typography className={styles.union}>-</Typography>
          <Typography className={styles.name2}>{team2.name}</Typography>
          <Typography className={styles.score2}>{team2.score}</Typography>
        </div>
      </div>
      {onEdit ? (
        <div className={styles.buttonsContainer}>
          <CustomIconButton
            className={styles.icon}
            onClick={onEdit}
            tooltip={t('edit_game')}
            icon="Edit"
            style={{ color: 'primary' }}
          />
          <CustomIconButton
            className={styles.icon}
            onClick={onDelete}
            tooltip={t('delete')}
            icon="Delete"
            style={{ color: 'primary' }}
          />
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <CustomIconButton
            className={styles.icon}
            onClick={onDelete}
            tooltip={t('delete')}
            icon="Delete"
            style={{ color: 'primary' }}
          />
        </div>
      )}
    </Card>
  );
}
