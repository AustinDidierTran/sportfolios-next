import React, { useMemo } from 'react';

import styles from './ScoreSuggestion.module.css';

import CustomIconButton from '../../IconButton';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatDate } from '../../../../utils/stringFormats';
import { STATUS_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import api from '../../../../actions/api';

const useStyles = makeStyles(() => ({
  secondary: {
    background: '#f44336',
    '&:hover, &.Mui-focusVisible': { backgroundColor: '#b2102f' },
  },
  primary: {
    background: '#18B393',
    '&:hover, &.Mui-focusVisible': { backgroundColor: '#009687' },
  },
  even: {
    background: '#e9e9e9',
  },
  odd: {
    background: 'lightGrey',
  },
}));

export default function ScoreSuggestion(props) {
  const { game, suggestion, index, update } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  let className = classes.odd;
  if (index % 2 === 0) {
    className = classes.even;
  }

  const chipStyle = useMemo(() => {
    switch (suggestion.status) {
      case STATUS_ENUM.ACCEPTED:
        return { border: '1px solid #18B393', color: '#18B393 ' };
      case STATUS_ENUM.REFUSED:
        return { border: '1px solid #f44336', color: '#f44336 ' };
      case STATUS_ENUM.PENDING:
        return { border: '1px solid #dddd00', color: '#dddd00 ' };
      default:
        return { border: '1px solid #18B393', color: '#18B393 ' };
    }
  }, [suggestion]);

  const updateStatus = async (status) => {
    await api('/api/entity/updateSuggestionStatus', {
      method: 'PUT',
      body: JSON.stringify({
        eventId: game.event_id,
        id: suggestion.id,
        gameId: game.id,
        scores: suggestion.score,
        status,
      }),
    });
    update();
  };

  const accept = () => {
    updateStatus(STATUS_ENUM.ACCEPTED);
  };
  const refuse = () => {
    updateStatus(STATUS_ENUM.REFUSED);
  };

  return (
    <Card className={className}>
      <div className={styles.card}>
        <div className={styles.game}>
          <ListItemText
            className={styles.person}
            primary={suggestion.name}
            secondary={formatDate(moment(suggestion.created_at), 'D MMM H:mm')}
          ></ListItemText>
          <Typography className={styles.score1}>{suggestion.score[game.positions[0].roster_id]}</Typography>
          <Typography className={styles.union}>-</Typography>
          <Typography className={styles.score2}>{suggestion.score[game.positions[1].roster_id]}</Typography>
          <Chip
            label={t(suggestion.status)}
            style={chipStyle}
            variant="outlined"
            className={styles.status}
            size="small"
          />
        </div>
        <div className={styles.buttons}>
          <CustomIconButton
            className={classes.primary}
            icon="Check"
            color="inherit"
            onClick={accept}
            style={{ margin: '4px' }}
            tooltip={t('accept')}
          />
          <CustomIconButton
            className={classes.secondary}
            color="inherit"
            icon="Close"
            onClick={refuse}
            style={{ margin: '4px' }}
            tooltip={t('refuse')}
          />
        </div>
      </div>
    </Card>
  );
}
