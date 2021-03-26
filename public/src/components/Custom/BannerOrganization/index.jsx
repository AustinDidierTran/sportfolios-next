import React, { useState, useEffect } from 'react';
import Avatar from '../Avatar';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import styles from './BannerOrganization.module.css';
import api from '../../../actions/api';
import { formatRoute } from '../../../../common/utils/stringFormat';
import { useRouter } from 'next/router';

export default function BannerOrganization(props) {
  const { basicInfos, onClickMainButton } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    getHasMemberships();
  }, []);

  const [hasMemberships, setHasMemberships] = useState(false);

  const getHasMemberships = async () => {
    const { data } = await api(
      formatRoute('/api/entity/hasMemberships', null, {
        id,
      })
    );
    setHasMemberships(data);
  };
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
            <CustomButton onClick={onClickMainButton} disabled={!hasMemberships} className={styles.eventButton}>
              {t('become_member')}
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
