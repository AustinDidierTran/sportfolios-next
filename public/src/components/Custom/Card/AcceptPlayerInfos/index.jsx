import React from 'react';

import Button from '../../Button';
import { useTranslation } from 'react-i18next';
import styles from './AcceptPlayerInfos.module.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '../../Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { getMembershipName } from '../../../../utils/stringFormats';
import { MEMBERSHIP_TYPE_ENUM } from '../../../../../common/enums';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '300px',
    flex: '1 1 auto',
    margin: '4px auto',
    backgroundColor: theme.palette.primary.veryLight,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  media2: {
    height: 200,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    gridArea: 'more',
    alignSelf: 'center',
    justifySelf: 'center',
    transform: 'rotate(0deg)',

    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    margin: '0px',
  },
}));
export default function AcceptPlayerInfos(props) {
  const { playerInfos } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        className={styles.header}
        avatar={<Avatar aria-label="recipe" className={classes.avatar} photoUrl={playerInfos?.photoUrl}></Avatar>}
        title={`${playerInfos?.name} ${playerInfos?.surname}`}
        subheader={playerInfos?.teamName}
      />
      <CardContent>
        <Typography color={playerInfos?.birthDate ? 'textPrimary' : 'error'}>
          {t('birth_date')}: {playerInfos?.birthDate || t('missing_info')}
        </Typography>
        <Typography color={playerInfos?.gender ? 'textPrimary' : 'error'}>
          {t('gender')}: {t(playerInfos?.gender) || t('missing_info')}
        </Typography>
        <Typography color={playerInfos?.address?.city ? 'textPrimary' : 'error'}>
          {t('city')}: {playerInfos?.address?.city || t('missing_info')}
        </Typography>
        <Typography color={playerInfos?.address?.zip ? 'textPrimary' : 'error'}>
          {t('postal_code')}: {playerInfos?.address?.zip || t('missing_info')}
        </Typography>
        {/* TODO get real infos its only a mock for now */}
        <Typography color={'textPrimary'}>
          {t('member.member')}: {t(getMembershipName(MEMBERSHIP_TYPE_ENUM.RECREATIONAL))}
        </Typography>
        <Button onClick={() => {}} color={'secondary'} className={styles.button}>
          {t('decline')}
        </Button>
        <Button onClick={() => {}} className={styles.button}>
          {t('accept')}
        </Button>
      </CardContent>
    </Card>
  );
}
