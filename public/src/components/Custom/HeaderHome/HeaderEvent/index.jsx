import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styles from '../HeaderHome.module.css';
import CustomIcon from '../../Icon';
import { goTo, ROUTES } from '../../../../actions/goTo';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import { useWindowSize } from '../../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../../common/constants';
import { Store } from '../../../../Store';
import { COLORS } from '../../../../utils/colors';

const BannerEvent = dynamic(() => import('../../BannerEvent'));

export default function HeaderHome(props) {
  const { basicInfos, navTabs, eventInfo, onSwitch, isAdmin, adminView, index } = props;
  const [width] = useWindowSize();
  const {
    state: { id },
  } = useContext(Store);

  console.log({ navTabs });

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  // const handleSettingsClick = () => {
  // };

  const goToRegistration = () => {
    goTo(ROUTES.eventRegistration, { id });
  };

  return (
    <Paper elevation={1} className={styles.paper}>
      <BannerEvent
        basicInfos={basicInfos}
        onClickMainButton={goToRegistration}
        onSwitch={onSwitch}
        eventInfo={eventInfo}
        isAdmin={isAdmin}
        adminView={adminView}
      />
      <div className={styles.navigation}>
        <Tabs
          value={index}
          TabIndicatorProps={{
            style: { backgroundColor: COLORS.white },
          }}
          style={{
            color: COLORS.white,
            backgroundColor: COLORS.turquoise,
            minHeight: 0,
            borderRadius: width > MOBILE_WIDTH ? '7px' : '0px',
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
                  {width > MOBILE_WIDTH && (
                    <Typography variant="body2" className={styles.typo}>
                      {s.label}
                    </Typography>
                  )}
                </div>
              }
              fontSize={0.6}
              style={{
                borderRightColor: COLORS.white,
                borderRightStyle: navTabs.length === index + 1 ? 'none' : 'solid',
                borderRightWidth: 1,
                minHeight: 0,
                minWidth: 0,
              }}
            />
          ))}
        </Tabs>
        {/* <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {isAdmin && (
            <>
              <MenuItem onClick={() => {}}>{t('view_as_admin')}</MenuItem>
            </>
          )}
        </Menu> */}
      </div>
    </Paper>
  );
}
