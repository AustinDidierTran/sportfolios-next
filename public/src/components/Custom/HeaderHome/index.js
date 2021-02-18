import React, { useState } from 'react';
import Avatar from '../Avatar';
import CustomButton from '../Button';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { FORM_DIALOG_TYPE_ENUM, ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import FormDialog from '../FormDialog';
import styles from './HeaderHome.module.css';
import CustomIcon from '../Icon';
import Button from '@material-ui/core/Button';

export default function HeaderHome(props) {
  const { type, navigationComponent, basicInfos, navTabs, ...otherProps } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { query, route } = router;
  const onglet = route.split('/')[2] ? route.split('/')[2] : 'home';
  const { id } = query;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {};

  const handleSettingsClick = () => {
    router.push({
      pathname: '/[pid]/[slug]',
      query: {
        pid: id,
        slug: 'edit',
      },
    });
  };

  const seeEdit = basicInfos.role == ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role == ENTITIES_ROLE_ENUM.EDITOR;

  return (
    <Paper elevation={1} className={styles.paper}>
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
              {/* Rediriger vers l'onglet affiliation */}
              <CustomButton onClick={onOpen} className={styles.eventButton}>
                {t('become_member')}
              </CustomButton>
              {/* Afficher le menu mobile en gros à partir d'en bas *voir fb* */}
              {window.innerWidth < 600 && (
                <Button variant="contained" className={styles.optionsButton} onClick={handleClick}>
                  <CustomIcon icon="MoreVertIcon" />
                </Button>
              )}
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
              minHeight: 0,
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
                  minHeight: 0,
                  minWidth: 0,
                }}
              />
            ))}
            {window.innerWidth > 600 && (
              <Tab
                icon={<CustomIcon icon="MoreVertIcon" />}
                style={{
                  marginLeft: 'auto',
                  minWidth: 0,
                  minHeight: 0,
                }}
                onClick={handleClick}
              />
            )}
          </Tabs>
        </Paper>
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
          items={{
            open,
            onClose,
            update,
          }}
        />
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {seeEdit && <MenuItem onClick={handleSettingsClick}>{t('settings')}</MenuItem>}
          <MenuItem onClick={handleClose}>{t('share')}</MenuItem>
        </Menu>
      </div>
    </Paper>
  );
}
