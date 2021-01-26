import React from 'react';
import Box from '@material-ui/core/Box';
import { Avatar } from '../../Custom';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import styles from './Organisation.module.css';

export default function HeaderHomeOrg(props) {
  const { type, photoUrl, ...otherProps } = props;
  const { t } = useTranslation();

  return (
    <Paper className={styles.paper} boxShadow={2}>
      <div className={styles.root}>
        <Grid container>
          <Grid item lg={4} xs={12}>
            <Avatar photoUrl={photoUrl} size="lg" className={styles.avatar}></Avatar>
          </Grid>
          <Grid item lg={8} xs={12} container>
            <Grid container className={styles.gridText}>
              <div className={styles.title}>Les fous du disques</div>

              <div className={styles.subtitle}>3068 College Sherbrooke QC J1M 1V6</div>
            </Grid>
            <Grid container className={styles.gridButton}>
              <CustomButton className={styles.eventButton}>{t('become_member')}</CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}
