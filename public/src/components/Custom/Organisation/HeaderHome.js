import React from 'react';
import { Avatar } from '../../Custom';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styles from './Organisation.module.css';

export default function HeaderHomeOrg(props) {
  const { type, photoUrl, navigationComponent, basicInfos, navTabs, ...otherProps } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { query, route } = router;
  const onglet = route.split('/')[2] ? route.split('/')[2] : 'home';
  const { id } = query;

  return (
    <Paper className={styles.paper}>
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
      <div className={styles.navigation}>
        <Paper>
          <Tabs
            value={navTabs.findIndex((s) => s.value === onglet)}
            TabIndicatorProps={{ style: { display: 'none' } }}
            style={{
              color: 'white',
              backgroundColor: '#18B393',
            }}
            variant="scrollable"
            scrollButtons="off"
          >
            {navTabs.map((s, index) => (
              <Tab
                key={index}
                onClick={() => {
                  router.push({
                    pathname: '/[pid]/[slug]',
                    query: {
                      pid: id,
                      slug: s.value,
                    },
                  });
                }}
                label={t(s.label)}
                fontSize={0.6}
                style={{
                  borderRightColor: 'white',
                  borderRightStyle: navTabs.length === index + 1 ? 'none' : 'solid',
                  borderRightWidth: 1,
                }}
              />
            ))}
          </Tabs>
        </Paper>
      </div>
    </Paper>
  );
}
