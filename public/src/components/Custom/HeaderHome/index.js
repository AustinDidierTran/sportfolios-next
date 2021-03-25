import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';

import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { FORM_DIALOG_TYPE_ENUM, ENTITIES_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import FormDialog from '../FormDialog';
import styles from './HeaderHome.module.css';
import CustomIcon from '../Icon';
import { goTo, ROUTES } from '../../../actions/goTo';

import BannerOrganization from '../BannerOrganization';
import BannerEvent from '../BannerEvent';
import { Typography } from '@material-ui/core';

export default function HeaderHome(props) {
  const { type, basicInfos, navTabs, eventInfo } = props;
  // const { t } = useTranslation();
  const router = useRouter();
  const { id, tab } = router.query;

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleClick = (event) => {
  // setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  // const handleSettingsClick = () => {
  //   router.push({
  //     pathname: '/[pid]/[slug]',
  //     query: {
  //       pid: id,
  //       slug: 'edit',
  //     },
  //   });
  // };
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {};

  const goToRegistration = () => {
    goTo(ROUTES.eventRegistration, { id });
  };

  const seeEdit = basicInfos.role == ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role == ENTITIES_ROLE_ENUM.EDITOR;
  return (
    <Paper elevation={1} className={styles.paper}>
      {type === GLOBAL_ENUM.ORGANIZATION && (
        <BannerOrganization basicInfos={basicInfos} onClickMainButton={onOpen} isAdmin={seeEdit} />
      )}
      {type === GLOBAL_ENUM.EVENT && (
        <BannerEvent
          basicInfos={basicInfos}
          onClickMainButton={goToRegistration}
          // onClickSecondButton={handleClick}
          eventInfo={eventInfo}
          isAdmin={seeEdit}
        />
      )}
      <div className={styles.navigation}>
        <Tabs
          value={navTabs.findIndex((s) => s.value === tab)}
          TabIndicatorProps={{ style: { display: 'none' } }}
          style={{
            color: 'white',
            backgroundColor: '#18B393',
            minHeight: 0,
            borderRadius: window.innerWidth > 600 ? '7px' : '0px',
          }}
          variant="fullWidth"
          scrollButtons="off"
        >
          {navTabs.map((s, index) => (
            <Tab
              key={index}
              onClick={() => {
                goTo(ROUTES.entity, { id }, { tab: s.value });
              }}
              label={
                <div className={styles.div}>
                  <CustomIcon icon={s.icon} />
                  {window.innerWidth > 600 && (
                    <Typography variant="body2" className={styles.typo}>
                      {s.label}
                    </Typography>
                  )}
                </div>
              }
              fontSize={0.6}
              style={{
                borderRightColor: 'white',
                borderRightStyle: navTabs.length === index + 1 ? 'none' : 'solid',
                borderRightWidth: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: 'auto',
              }}
            />
          ))}
          {/* {window.innerWidth > 600 && seeEdit && (
              <Tab
                icon={<CustomIcon icon="MoreVertIcon" />}
                style={{
                  marginLeft: 'auto',
                  minWidth: 0,
                  minHeight: 0,
                }}
                onClick={handleClick}
              />
            )} */}
        </Tabs>
        <FormDialog
          type={FORM_DIALOG_TYPE_ENUM.BECOME_MEMBER}
          items={{
            open,
            onClose,
            update,
          }}
        />
        {/* Menu sous forme de 3 petits au bout de la navBar va certainement être utilisé dans le future */}
        {/* <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {seeEdit && type === GLOBAL_ENUM.EVENT && (
            <>
              <MenuItem
                onClick={() => {
                  router.push({
                    pathname: '/[pid]/[slug]',
                    query: {
                      pid: id,
                      slug: 'editRankings',
                    },
                  });
                }}
              >
                {t('edit.edit_ranking')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push({
                    pathname: '/[pid]/[slug]',
                    query: {
                      pid: id,
                      slug: 'editRosters',
                    },
                  });
                }}
              >
                {t('edit.edit_teams')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  router.push({
                    pathname: '/[pid]/[slug]',
                    query: {
                      pid: id,
                      slug: 'editSchedule',
                    },
                  });
                }}
              >
                {t('edit.edit_schedule')}
              </MenuItem>
            </>
          )}
          {seeEdit && <MenuItem onClick={handleSettingsClick}>{t('settings')}</MenuItem>}
        </Menu> */}
      </div>
    </Paper>
  );
}
