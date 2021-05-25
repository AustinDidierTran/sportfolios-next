import React, { useState, useEffect, useMemo, useContext } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM, ROUTES_ENUM, STATUS_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../../actions/api';
import { goTo } from '../../../actions/goTo';
import { Store } from '../../../Store';

const HeaderHome = dynamic(() => import('../../../components/Custom/HeaderHome'));
const Home = dynamic(() => import('../../../tabs/Home'));
const Events = dynamic(() => import('../../../tabs/Events'));
const Memberships = dynamic(() => import('../../../tabs/Memberships'));
const Settings = dynamic(() => import('../../../tabs/Settings'));
const Partners = dynamic(() => import('../../../tabs/Partners'));
const EditMemberships = dynamic(() => import('../../../tabs/EditMemberships'));

export default function Organization(props) {
  const { t } = useTranslation();
  const { basicInfos: basicInfosProps } = props;
  const router = useRouter();
  const { tab } = router.query;
  const {
    state: { id },
  } = useContext(Store);
  const [basicInfos, setBasicInfos] = useState(basicInfosProps);

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos.name]);

  useEffect(() => {
    if (id) {
      getRole();
    }
  }, [id]);

  const userState = [
    { component: Home, value: TABS_ENUM.HOME, label: t('home'), icon: 'Home' },
    { component: Events, value: TABS_ENUM.EVENTS, label: t('event.events'), icon: 'Event' },
    { component: Memberships, value: TABS_ENUM.MEMBERSHIPS, label: t('member.memberships'), icon: 'Group' },
    { component: Partners, value: TABS_ENUM.PARTNERS, label: t('partner.partners'), icon: 'EmojiPeople' },
  ];

  const adminState = [
    { component: Home, value: TABS_ENUM.HOME, label: t('home'), icon: 'Home' },
    { component: Events, value: TABS_ENUM.EVENTS, label: t('event.events'), icon: 'Event' },
    { component: EditMemberships, value: TABS_ENUM.EDIT_MEMBERSHIPS, label: t('member.memberships'), icon: 'Group' },
    { component: Settings, value: TABS_ENUM.SETTINGS, label: t('settings'), icon: 'Settings' },
  ];

  const [adminView, setAdminView] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [states, setStates] = useState(userState);

  const index = useMemo(() => {
    if (adminState.find((s) => s.value === tab) && tab != TABS_ENUM.HOME && tab != TABS_ENUM.EVENTS) {
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

  const OpenTab = useMemo(() => {
    const res = states[index];
    if (res) {
      return res.component;
    }
    return Home;
  }, [index, states]);

  const onSwitch = () => {
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

  const getRole = async () => {
    const res = await api(formatRoute('/api/entity/role', null, { entityId: id }));
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
          <OpenTab basicInfos={basicInfos} adminView={adminView} />
        </div>
      </IgContainer>
    </>
  );
}
