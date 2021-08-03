import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

import CustomAvatar from '../../Avatar';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

import styles from './TwoTeamGameProfile.module.css';
import { AvatarGroup } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: theme.spacing(1.5),
  },
}));

export default function TwoTeamGameProfile(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { event_id, event_name, field, timeslot, team_names, team_scores, playersinfos, onClick } = props;

  const team1 = {
    name: team_names[0],
    score: team_scores[0],
    players: playersinfos[0],
  };
  const team2 = {
    name: team_names[1],
    score: team_scores[1],
    players: playersinfos[1],
  };

  return (
    <Card className={styles.gameCard}>
      <div className={styles.main} onClick={() => onClick(event_id)}>
        <Typography className={styles.event} color="textSecondary">
          {event_name}
        </Typography>
        {timeslot ? (
          <ListItemText
            className={styles.time}
            primary={formatDate(moment.utc(timeslot), 'HH:mm')}
            secondary={formatDate(moment.utc(timeslot), 'D MMM')}
          />
        ) : (
          <ListItemText className={styles.time} primary={t('no.no_time_yet')} secondary={t('no.no_date_yet')} />
        )}
        <Typography className={styles.field} color="textSecondary">
          {field ? field : t('no.no_field_yet')}
        </Typography>
        <AvatarGroup className={styles.players1} classes={{ avatar: classes.avatar }} max={4}>
          {team1.players
            ? team1.players.map((p, index) => (
                <CustomAvatar key={`team1-${index}`} className={styles.bubbleStack} photoUrl={p.photo} />
              ))
            : undefined}
        </AvatarGroup>
        <AvatarGroup className={styles.players2} classes={{ avatar: classes.avatar }} max={4}>
          {team2.players
            ? team2.players.map((p, index) => (
                <CustomAvatar key={`team2-${index}`} className={styles.bubbleStack} photoUrl={p.photo} />
              ))
            : undefined}
        </AvatarGroup>

        <Typography className={styles.name1}>{team1.name}</Typography>
        <Typography className={styles.score1}>{team1.score}</Typography>
        <Typography className={styles.union}>-</Typography>
        <Typography className={styles.name2}>{team2.name}</Typography>
        <Typography className={styles.score2}>{team2.score}</Typography>
      </div>
    </Card>
  );
}
