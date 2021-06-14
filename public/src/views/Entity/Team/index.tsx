import React, { useState, useEffect, useMemo, useContext } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM, ROUTES_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { goTo } from '../../../actions/goTo';
import { Store } from '../../../Store';
import { Entity, Practice } from '../../../../../typescript/types';
import { getRole as getRoleApi } from '../../../actions/service/entity';

const HeaderHome = dynamic(() => import('../../../components/Custom/HeaderHome'));
const Home = dynamic(() => import('../../../tabs/Home'));
const TeamEvents = dynamic(() => import('../../../tabs/TeamEvents'));
const TeamRosters = dynamic(() => import('../../../tabs/TeamRosters'));
const Settings = dynamic(() => import('../../../tabs/Settings'));

interface IProps {
  basicInfos: Entity;
  eventInfos: IEventInfos;
}

interface IGameInfos {
  eventId: string;
  eventName: string;
  id: string;
  timeslot: string;
  field: string;
  name: string;
  teamNames: string;
  teamScores: string;
}

interface IEventInfos {
  gamesInfos: IGameInfos[];
  practiceInfos: Practice[];
}

interface IStates {
  component: any;
  value: string;
  label: string;
  icon: string;
}

const Team: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { basicInfos: basicInfosProps, eventInfos: eventInfosProps } = props;
  const router = useRouter();
  const { tab } = router.query;
  const {
    state: { id },
  } = useContext(Store);
  const [basicInfos, setBasicInfos] = useState<Entity>(basicInfosProps);
  const gamesInfos = eventInfosProps?.gamesInfos;
  const practiceInfos = eventInfosProps?.practiceInfos;

  useEffect((): void => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos.name]);

  useEffect((): void => {
    if (id) {
      getRole();
    }
  }, [id]);

  const userState = [
    { component: Home, value: TABS_ENUM.HOME, label: t('info'), icon: 'Info' },
    { component: TeamEvents, value: TABS_ENUM.TEAM_EVENTS, label: t('event.events'), icon: 'Event' },
    { component: TeamRosters, value: TABS_ENUM.TEAM_ROSTERS, label: t('rosters'), icon: 'Group' },
  ];

  const adminState = [
    { component: Settings, value: TABS_ENUM.SETTINGS, label: t('settings'), icon: 'Settings' },
    { component: TeamEvents, value: TABS_ENUM.TEAM_EVENTS, label: t('event.events'), icon: 'Event' },
    { component: TeamRosters, value: TABS_ENUM.TEAM_ROSTERS, label: t('rosters'), icon: 'Group' },
  ];

  const [adminView, setAdminView] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [states, setStates] = useState<IStates[]>(userState);

  const index = useMemo(() => {
    if (adminState.find((s) => s.value === tab) && tab != TABS_ENUM.TEAM_EVENTS && tab != TABS_ENUM.TEAM_ROSTERS) {
      if (isAdmin) {
        setStates(adminState);
        setAdminView(true);
        return adminState.findIndex((s) => s.value === tab);
      }
    }
    const res = states.findIndex((s) => s.value === tab);
    if (res === -1) {
      return 0;
    }
    return res;
  }, [tab, isAdmin]);

  const OpenTab = useMemo((): React.ComponentType<any> => {
    const res = states[index];
    if (res) {
      return res.component;
    }
    return Home;
  }, [index, states]);

  const onSwitch = (): void => {
    const newState = !adminView;
    setAdminView(newState);
    if (newState) {
      setStates(adminState);
      goTo(ROUTES_ENUM.entity, { id }, { tab: adminState[index].value });
    } else {
      setStates(userState);
      goTo(ROUTES_ENUM.entity, { id }, { tab: userState[index].value });
    }
  };

  const getRole = async (): Promise<void> => {
    const res = await getRoleApi(id);
    if (res.status === STATUS_ENUM.SUCCESS_STRING) {
      let newInfos = basicInfos;
      newInfos.role = res.data;
      setBasicInfos(newInfos);
      setIsAdmin(res.data === ENTITIES_ROLE_ENUM.EDITOR || res.data === ENTITIES_ROLE_ENUM.ADMIN);
    }
  };

  return (
    <>
      <HeaderHome
        basicInfos={basicInfos}
        isAdmin={isAdmin}
        onSwitch={onSwitch}
        index={index}
        adminView={adminView}
        navTabs={states}
        type={GLOBAL_ENUM.ORGANIZATION}
      />
      <IgContainer>
        <div>
          <OpenTab
            basicInfos={basicInfos}
            gamesInfos={gamesInfos}
            practiceInfos={practiceInfos}
            adminView={adminView}
          />
        </div>
      </IgContainer>
    </>
  );
};
export default Team;
