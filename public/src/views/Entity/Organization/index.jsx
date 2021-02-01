import React, { useState, useEffect, useMemo } from 'react';

import { Paper, IgContainer, Icon } from '../../../components/Custom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import TabsGenerator from '../../../tabs';
import { goTo, ROUTES } from '../../../actions/goTo';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  fabMobile: {
    position: 'absolute',
    bottom: theme.spacing(2) + 58,
    right: theme.spacing(2),
    zIndex: 100,
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2) + (window.innerWidth - 700) / 2,
    zIndex: 100,
    color: 'white',
  },
}));

export default function Organization(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos } = props;
  const router = useRouter();
  const { query } = router;
  const { id } = query;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(query.tab || TABS_ENUM.EVENTS);

  const [isAdmin, setIsAdmin] = useState(false);

  const userState = TabsGenerator({
    list: [TABS_ENUM.EVENTS, TABS_ENUM.ABOUT],
    role: basicInfos.role,
  });

  const adminState = TabsGenerator({
    list: [TABS_ENUM.EDIT_EVENTS, TABS_ENUM.SETTINGS],
    role: basicInfos.role,
  });

  const [states, setStates] = useState(userState);

  const getStates = (isAdmin) => {
    isAdmin ? setStates(adminState) : setStates(userState);
  };

  const OpenTab = useMemo(() => {
    if (states.map((s) => s.value).includes(eventState)) {
      return states.find((s) => s.value == eventState).component;
    } else {
      if (adminState.map((a) => a.value).includes(eventState)) {
        if (basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR) {
          setIsAdmin(true);
          setStates(adminState);
          return;
        }
      }
      setIsAdmin(false);
      setStates(userState);
      setEventState(TABS_ENUM.EVENTS);
    }
  }, [eventState, states]);

  const onClick = (s) => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  const onSwitch = () => {
    const newState = !isAdmin;
    setIsAdmin(newState);
    getStates(newState);
    if (newState) {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EDIT_EVENTS });
      setEventState(TABS_ENUM.EDIT_EVENTS);
    } else {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EVENTS });
      setEventState(TABS_ENUM.EVENTS);
    }
  };

  const title = useMemo(() => {
    if (isAdmin) {
      return t('player_view');
    } else {
      return t('admin_view');
    }
  }, [isAdmin]);

  if (!states || states.length == 1) {
    return (
      <IgContainer>
        <OpenTab basicInfos={basicInfos} />
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <Paper>
        <Tabs value={states.findIndex((s) => s.value === eventState)} indicatorColor="primary" textColor="primary">
          {states.map((s, index) => (
            <Tab
              key={index}
              onClick={() => onClick(s)}
              label={window.innerWidth < 768 ? null : s.label}
              icon={<Icon icon={s.icon} />}
              style={{
                minWidth: window.innerWidth < 768 ? window.innerWidth / states.length : 700 / states.length,
              }}
            />
          ))}
        </Tabs>
      </Paper>
      {basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR ? (
        <Tooltip title={title}>
          <Fab color="primary" onClick={onSwitch} className={window.innerWidth < 768 ? classes.fabMobile : classes.fab}>
            <Icon icon="Autorenew" />
          </Fab>
        </Tooltip>
      ) : (
        <></>
      )}
      <div>
        <OpenTab basicInfos={basicInfos} />
      </div>
    </IgContainer>
  );
}
