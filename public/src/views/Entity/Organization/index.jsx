import React, { useState, useEffect, useMemo } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import Icon from '../../../components/Custom/Icon';
import HeaderHome from '../../../components/Custom/HeaderHome';

import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import TabsGenerator from '../../../tabs';
import { goTo, ROUTES } from '../../../actions/goTo';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM, TABS_ENUM } from '../../../../common/enums';
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
  const { id, tab } = query;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [isAdmin, setIsAdmin] = useState(false);

  const userTabs = TabsGenerator({
    list: [TABS_ENUM.EVENTS, TABS_ENUM.ABOUT],
    role: basicInfos.role,
  });

  const adminTabs = TabsGenerator({
    list: [TABS_ENUM.EDIT_EVENTS, TABS_ENUM.SETTINGS],
    role: basicInfos.role,
  });

  const onSwitch = () => {
    const newState = !isAdmin;
    setIsAdmin(newState);
    if (newState) {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EDIT_EVENTS });
    } else {
      goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.EVENTS });
    }
  };

  const title = useMemo(() => {
    if (isAdmin) {
      return t('player_view');
    } else {
      return t('admin_view');
    }
  }, [isAdmin]);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={isAdmin ? adminTabs : userTabs} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer>
        {basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR ? (
          <Tooltip title={title}>
            <Fab
              color="primary"
              onClick={onSwitch}
              className={window.innerWidth < 768 ? classes.fabMobile : classes.fab}
            >
              <Icon icon="Autorenew" />
            </Fab>
          </Tooltip>
        ) : (
          <></>
        )}
      </IgContainer>
    </>
  );
}
