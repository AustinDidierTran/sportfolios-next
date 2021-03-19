import React from 'react';
import Avatar from '../Avatar';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';

import styles from './BannerOrganization.module.css';
import CustomIcon from '../Icon';
import Button from '@material-ui/core/Button';

export default function BannerOrganization(props) {
  const { basicInfos, onClickMainButton, onClickSecondButton, isAdmin } = props;
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
            <CustomButton onClick={onClickMainButton} className={styles.eventButton}>
              {t('become_member')}
            </CustomButton>

            {/* Afficher le menu mobile en gros à partir d'en bas *voir fb* */}
            {window.innerWidth < 600 && isAdmin && (
              <Button variant="contained" className={styles.optionsButton} onClick={onClickSecondButton}>
                <CustomIcon icon="MoreVertIcon" />
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
