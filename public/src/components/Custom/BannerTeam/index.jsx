import React from 'react';
import Avatar from '../Avatar';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import styles from './BannerTeam.module.css';

export default function BannerTeam(props) {
  const { basicInfos, onJoinTeamButton, onOpenToLoggin, isAuthenticated, isAdmin, onSwitch, adminView } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Grid container>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Avatar photoUrl={basicInfos.photoUrl} size="lg" className={styles.avatar}></Avatar>
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} container>
          <Grid container className={styles.gridText}>
            <Grid container item className={styles.title}>
              {basicInfos.name}
            </Grid>
            <Grid container item className={styles.subtitle}>
              {basicInfos.city}
            </Grid>
          </Grid>
          <Grid container className={styles.gridButton}>
            <Button onClick={isAuthenticated ? onJoinTeamButton : onOpenToLoggin} className={styles.eventButton}>
              {t('join_team')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <div className={styles.divIconButton}>
        <div>
          {isAdmin && (
            <>
              {adminView ? (
                <Button
                  className={styles.view}
                  startIcon="Autorenew"
                  color="secondary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('player_view')}
                </Button>
              ) : (
                <Button
                  className={styles.view}
                  startIcon="Autorenew"
                  color="primary"
                  variant="outlined"
                  onClick={onSwitch}
                >
                  {t('admin_view')}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
