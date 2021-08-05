import React, { useEffect, useMemo, useState, useContext } from 'react';

import { formatPageTitle } from '../../../utils/stringFormats';
import { TABS_ENUM, GLOBAL_ENUM, ENTITIES_ROLE_ENUM, ROUTES_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { AddGaEvent } from '../../../components/Custom/Analytics';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import IgContainer from '../../../components/Custom/IgContainer';
import dynamic from 'next/dynamic';
import { goTo } from '../../../actions/goTo';
import { Store } from '../../../Store';
import { Entity, States } from '../../../../../typescript/types';
import { getRole as getRoleApi } from '../../../actions/service/entity/get';

const HeaderHome = dynamic(() => import('../../../components/Custom/HeaderHome'));
const Schedule = dynamic(() => import('../../../tabs/Schedule'));
const Rankings = dynamic(() => import('../../../tabs/Rankings'));
const Rosters = dynamic(() => import('../../../tabs/Rosters'));
const EventInfo = dynamic(() => import('../../../tabs/EventInfo'));
const EditSchedule = dynamic(() => import('../../../tabs/EditSchedule'));
const EditRankings = dynamic(() => import('../../../tabs/EditRankings'));
const EditRosters = dynamic(() => import('../../../tabs/EditRosters'));
const Settings = dynamic(() => import('../../../tabs/Settings'));

interface IProps {
  basicInfos: Entity;
  eventInfo: any;
}

const Event: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { basicInfos: basicInfosProps, eventInfo } = props;
  const router = useRouter();
  const { tab } = router.query;
  const {
    state: { id },
  } = useContext(Store);

  const [basicInfos, setBasicInfos] = useState<Entity>(basicInfosProps);

  useEffect((): void => {
    document.title = formatPageTitle(basicInfos.name);
    AddGaEvent({
      category: 'Visit',
      action: 'User visited event',
      label: 'Event_page',
    });
  }, [basicInfos.name]);

  useEffect((): void => {
    if (id) {
      getRole();
    }
  }, [id]);

  const userState = [
    { component: Schedule, value: TABS_ENUM.SCHEDULE, label: t('schedule'), icon: 'Assignment' },
    { component: Rankings, value: TABS_ENUM.RANKINGS, label: t('rankings'), icon: 'FormatListNumbered' },
    { component: Rosters, value: TABS_ENUM.ROSTERS, label: t('team.teams'), icon: 'Group' },
    { component: EventInfo, value: TABS_ENUM.EVENT_INFO, label: t('info'), icon: 'Info' },
  ];

  const adminState = [
    { component: EditSchedule, value: TABS_ENUM.EDIT_SCHEDULE, label: t('schedule'), icon: 'Assignment' },
    { component: EditRankings, value: TABS_ENUM.EDIT_RANKINGS, label: t('rankings'), icon: 'FormatListNumbered' },
    { component: EditRosters, value: TABS_ENUM.EDIT_ROSTERS, label: t('team.teams'), icon: 'Group' },
    { component: Settings, value: TABS_ENUM.SETTINGS, label: t('settings'), icon: 'Settings' },
  ];

  const [adminView, setAdminView] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [states, setStates] = useState<States[]>(userState);

  const index = useMemo((): number => {
    if (adminState.find((s) => s.value === tab)) {
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

  const OpenTab = useMemo((): any => {
    const res = states[index];
    if (res) {
      return res.component;
    }
    return Schedule;
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
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      const newInfos = basicInfos;
      newInfos.role = res.data;
      setBasicInfos(newInfos);
      setIsAdmin(res.data === ENTITIES_ROLE_ENUM.EDITOR || res.data === ENTITIES_ROLE_ENUM.ADMIN);
    }
  };

  return (
    <>
      <HeaderHome
        basicInfos={basicInfos}
        eventInfo={eventInfo}
        navTabs={states}
        type={GLOBAL_ENUM.EVENT}
        onSwitch={onSwitch}
        adminView={adminView}
        index={index}
        isAdmin={isAdmin}
      />
      <IgContainer>
        <div>
          <OpenTab basicInfos={basicInfos} eventInfo={eventInfo} />
        </div>
      </IgContainer>
    </>
  );
};
export default Event;
