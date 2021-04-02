import React, { useEffect, useContext, useMemo } from 'react';

import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import { Store } from '../../Store';
import { useTranslation } from 'react-i18next';
import AppLinking from './AppLinking';

import loadable from '@loadable/component';

const BasicInfo = loadable(() => import('./BasicInfo'));
const BottomPageLogo = loadable(() => import('../../components/Custom/BottomPageLogo'));
const ChangePassword = loadable(() => import('./ChangePassword'));
const Coupons = loadable(() => import('./Coupons'));
const CreditCards = loadable(() => import('./CreditCards'));
const Disconnect = loadable(() => import('./Disconnect'));
const Email = loadable(() => import('./Email'));
const MyPersons = loadable(() => import('./MyPersons'));
const NewsLetterEmail = loadable(() => import('./Email/NewsLetterEmail'));
const Notifications = loadable(() => import('./Notifications'));

export default function UserSettings() {
  const { t } = useTranslation();
  const { state } = useContext(Store);
  useEffect(() => {
    document.title = formatPageTitle(t('settings'));
  }, []);

  const isLoggedIn = useMemo(() => Boolean(state.userInfo), [state.userInfo]);

  //Scroll to given section specified with # in the url
  const scroll = () => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      const anchor = document.getElementById(hash);
      setTimeout(() => {
        anchor?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 500);
    }
  };
  useEffect(scroll, []);

  if (!isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Coupons />
      <BasicInfo />
      <Email />
      <NewsLetterEmail />
      <MyPersons />
      <ChangePassword />
      <AppLinking />
      <CreditCards />
      <div id="notifications">
        <Notifications />
      </div>
      <Disconnect />
      <BottomPageLogo />
    </IgContainer>
  );
}
